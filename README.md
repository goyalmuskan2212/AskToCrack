# AskToCrack

AskToCrack is a web app for AI-powered interview preparation. It lets users create sessions, get interview questions and concept explanations, and manage their profile.

## Main Features
- User authentication (login/signup)
- Create and manage interview sessions
- Get AI-generated interview questions and explanations
- Profile photo upload

## Quick Start

### Backend
1. `cd backend`
2. `npm install`
3. Add a `.env` file with your MongoDB URI and other secrets
4. `npm start`

### Frontend
1. `cd frontend/interview-prep-ai`
2. `npm install`
3. `npm run dev`

## Usage
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000](http://localhost:5000)

## Tech Stack
- Backend: Node.js, Express, MongoDB
- Frontend: React, Vite

## API Highlights
- `/api/auth` - Auth routes
- `/api/sessions` - Interview sessions
- `/api/questions` - Questions
- `/api/ai/generate-questions` - AI interview questions
- `/api/ai/generate-explanation` - AI concept explanations
