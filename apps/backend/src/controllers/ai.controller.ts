import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const summarizeMeeting = async (req: Request, res: Response) => {
  try {
    const chatLogs = req.body.chatLogs;

    // Limit input to last 100 messages to prevent token bloat
    const recentLogs = chatLogs.slice(-100);

    if (!recentLogs || !Array.isArray(recentLogs) || recentLogs.length === 0) {
       return res.status(400).json({ message: 'No chat logs provided to summarize.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
       return res.status(500).json({ message: 'Gemini API Configuration missing.' });
    }

    // Prepare transcript
    const transcript = recentLogs.map((log: any) => `[${log.time}] ${log.sender}: ${log.message}`).join('\n');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an AI meeting assistant.

Analyze the following meeting conversation and return ONLY valid JSON in this format:

{
  "keyPoints": ["..."],
  "actionItems": [
    {
      "task": "...",
      "assignee": "...",
      "due": "..."
    }
  ]
}

Rules:
- No explanation
- No markdown
- No extra text
- Only JSON

Transcript:
${transcript}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean JSON markdown if Gemini returned it wrapped in json blocks
    const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    let summaryData;
    try {
      summaryData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Gemini returned an invalid JSON schema:', cleanedText);
      return res.status(500).json({ message: 'AI failed to generate a valid summary format. Please click retry.' });
    }

    res.status(200).json(summaryData);
  } catch (error) {
    console.error('Error generating AI Summary:', error);
    res.status(500).json({ message: 'Failed to generate AI summary', error });
  }
};
