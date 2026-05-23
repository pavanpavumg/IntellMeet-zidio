const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === 'your_gemini_api_key_here') {
  console.log("FAIL: No valid Gemini API key found in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function test() {
  console.log("Initiating connection to Google Gemini API...");
  try {
    const result = await model.generateContent("Analyze this message and reply with JSON: { 'status': 'success' }");
    const text = result.response.text();
    console.log("SUCCESS! Gemini successfully authorized and responded with:");
    console.log(text);
  } catch (err) {
    console.error("FAIL: Gemini API rejected the request.");
    console.error("Error details:", err.message);
  }
}

test();
