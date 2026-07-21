# Xuris

Xuris was built to solve a common problem faced by job seekers: understanding why applications are rejected and how to improve them. Rather than offering generic AI responses, Xuris combines resume analysis, job matching, interview preparation, application tracking, and cover letter generation into a single focused workspace that helps users apply with greater confidence.

> **Land more interviews. Not more applications.**

Xuris is an AI-powered career platform designed to help job seekers build stronger applications, improve their resumes, prepare for interviews, and stay organised throughout the job search.

Built as a full-stack SaaS application using React, Express, PostgreSQL, Clerk Authentication, Stripe Billing, and OpenAI.

---

## Features

### Resume Management

- Upload and securely store resumes
- Extract resume text automatically
- Organise multiple resume versions

### AI Resume Analysis

- ATS compatibility analysis
- Skill gap detection
- Resume strengths & weaknesses
- Formatting recommendations
- Keyword optimisation
- Actionable improvement suggestions

### Job Comparison

- Compare resumes against job descriptions
- Match required skills
- Identify missing experience
- Improve application relevance

### AI Cover Letters

- Generate tailored cover letters
- Match company tone
- Highlight relevant experience
- Edit and regenerate content

### Interview Preparation

- AI-generated interview questions
- Technical and behavioural preparation
- Role-specific guidance
- Suggested talking points

### Application Tracking

- Track submitted applications
- Store notes and interview stages
- Organise your job search in one place

### Authentication

- Secure authentication using Clerk
- Protected routes
- User-specific data

### Billing

- Stripe subscription integration
- Secure checkout
- Customer Portal
- Free and Premium plans

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Clerk
- shadcn/ui
- Lucide Icons

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- OpenAI API
- Stripe
- AWS:S3

### Infrastructure

- Vercel
- Render
- Neon PostgreSQL
- Clerk
- Stripe

---

## Project Structure

```
client/
├── src/
│   ├── components/
│   ├── features/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   └── providers/

server/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   ├── services/
│   ├── utils/
│   └── routes/
```

---

## Getting Started

### Clone

```bash
git clone https://github.com/sombas100/xuris.git
```

### Install

Frontend

```bash
cd client
npm install
```

Backend

```bash
cd server
npm install
```

---

## Environment Variables

The application requires environment variables for:

- Clerk Authentication
- PostgreSQL
- OpenAI
- Stripe
- File Storage

Create a `.env` file inside both the client and server using the provided `.env.example` files.

---

## Development

Frontend

```bash
npm run dev
```

Backend

```bash
npm run dev
```

---

## Production

Frontend

- Vercel

Backend

- Render

Database

- Neon PostgreSQL

Authentication

- Clerk

Payments

- Stripe

---

## Roadmap

Future improvements include:

- Resume version history
- Saved AI conversations
- Custom interview sessions
- Recruiter dashboard
- Team accounts
- Usage analytics
- AI career coaching
- Email notifications

---

## Screenshots

Coming soon.

---

## Live Demo

https://xuris.io

---

## Author

**Corey Clarke**

Software Engineer

GitHub:
https://github.com/sombas100

LinkedIn:
https://linkedin.com/in/corey-clarke100



---

## License

This project is licensed under the MIT License.
