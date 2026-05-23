# Deployment Guide - IntellMeet

## Prerequisites
- MongoDB Atlas account (or local MongoDB)
- GitHub repository (✅ Already set up)
- Environment variables configured

## Quick Start - Local Docker Deployment

```bash
# Copy environment variables
cp .env.example .env.local

# Build and run with Docker Compose
docker-compose up --build

# Access:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8000
```

---

## Production Deployment Options

### **Option 1: Railway (Recommended for Beginners)**

#### Backend Deployment:
1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select repository, choose `backend` branch
4. Add environment variables:
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT
   - `GOOGLE_GENERATIVE_AI_KEY` - Google AI API key
   - `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
5. Configure Port: `8000`
6. Deploy

#### Frontend Deployment:
1. Create another project on Railway
2. Deploy from same GitHub repo, `frontend` branch
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` - Your backend Railway URL
4. Deploy

---

### **Option 2: Vercel (Best for Next.js Frontend)**

#### Frontend:
1. Go to [vercel.com](https://vercel.com/dashboard)
2. Import Project → Select your GitHub repo
3. Select root directory: `apps/frontend`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` - Your backend URL
5. Deploy

#### Backend (Use Railway or Render instead)

---

### **Option 3: Docker + Any Cloud Provider**

#### Using Docker Compose (Local/Dev):
```bash
docker-compose up --build
```

#### Deploy to Cloud:

**AWS EC2:**
```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance.amazonaws.com

# Install Docker
sudo yum update -y
sudo yum install docker -y
sudo service docker start

# Clone and deploy
git clone https://github.com/pavanpavumg/IntellMeet-zidio.git
cd IntellMeet-zidio
docker-compose up -d
```

**DigitalOcean App Platform:**
1. Connect GitHub repository
2. Create 2 apps:
   - One for frontend (docker-compose service)
   - One for backend (docker-compose service)

---

### **Option 4: Heroku (Deprecated but still works)**

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create backend app
heroku create intell-meet-backend
git push heroku backend:main

# Create frontend app
heroku create intell-meet-frontend
git push heroku frontend:main
```

---

## Environment Variables Setup

Create `.env.local` file in project root:

```env
# Backend
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intell-meet
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=production

# Google AI
GOOGLE_GENERATIVE_AI_KEY=your-google-ai-key

# LiveKit
LIVEKIT_URL=https://your-livekit-instance.livekit.cloud
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret

# Frontend
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

---

## MongoDB Setup

### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create free account
3. Create cluster
4. Get connection string
5. Add to `MONGODB_URI`

### Option B: Local MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7

# Connection string
MONGODB_URI=mongodb://localhost:27017/intell-meet
```

---

## Building for Production

```bash
# Build all apps
pnpm run build

# Or individual builds
cd apps/backend && pnpm run build
cd apps/frontend && pnpm run build
```

---

## Health Checks

After deployment, verify:
```bash
# Backend health
curl https://your-backend-url.com/health

# Frontend
curl https://your-frontend-url.com
```

---

## Troubleshooting

### Port conflicts
- Change ports in `docker-compose.yml`
- Ensure firewall allows traffic

### MongoDB connection errors
- Verify `MONGODB_URI` is correct
- Check IP whitelist on MongoDB Atlas
- Ensure network access is enabled

### Build failures
- Clear cache: `pnpm store prune`
- Rebuild: `docker-compose up --build --no-cache`

### WebSocket connection issues (Socket.io)
- Ensure backend and frontend URLs match
- Check CORS settings in backend
- Verify ports 8000 and 3000 are accessible

---

## Recommended Deployment Stack

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Vercel | Free |
| Backend | Railway | ~$5/month |
| Database | MongoDB Atlas | Free |
| Real-time | LiveKit | Pay-as-you-go |

**Total Estimated Cost: $5-50/month** depending on usage
