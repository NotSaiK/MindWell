# MindWell – Secure Mental Wellness Application

## Project Overview

MindWell is a privacy-focused mental wellness web application developed as part of a Full Stack Developer Internship project. The application provides users with a secure environment to journal personal thoughts, track emotional well-being, and practice relaxation techniques, with data privacy treated as a core system requirement rather than an optional feature.

The project emphasizes secure data handling, clear system architecture, and real-world deployment practices.

---

## Problem Statement

Digital journaling applications often store highly sensitive personal data. Users may be hesitant to use such platforms due to concerns regarding data exposure, unauthorized database access, or internal misuse.

MindWell addresses this concern by implementing encryption at rest, ensuring that journal entries remain unreadable even to database administrators unless the correct decryption key is provided.

---

## Key Features

### Secure Journaling
- Users can create personal journal entries protected by a secret key.
- Journal content is encrypted before being stored in the database.
- Decryption occurs only when the correct secret key is supplied by the user.

### Mood Tracking and Analytics
- Daily mood logging on a scale of 1 to 10.
- Visualization of mood history using a line chart.
- Persistent storage of mood data across sessions.

### Wellness Tools
- Guided breathing exercise with smooth visual animation.
- Designed to help users relax and manage stress.

### User Experience
- Minimalist and calming interface.
- Light and dark mode support for improved usability.

### Data Export
- Users can export all personal data, including journal entries and mood logs, in JSON format.
- Supports user data ownership and transparency requirements (GDPR-aligned).

---

## Security and Encryption Design

MindWell implements AES-based encryption to secure journal content:

- Journal text is encrypted on the server before being persisted to MongoDB.
- The database stores only encrypted ciphertext rather than readable plain text.
- Decryption is performed only when the user provides the correct secret key.
- This approach ensures encryption at rest and protects sensitive user data even if database access is compromised.

Screenshots demonstrating encrypted database entries are included as proof of implementation.

---

## Technical Architecture

### Frontend
- React.js
- Chart.js for data visualization
- CSS animations for breathing exercises
- Deployed on Vercel

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Crypto-js (AES encryption)
- Deployed on Render

---

## Live Application

- **Frontend (Vercel):**  
  https://mind-well-mu.vercel.app/

- **Backend (Render):**  
  https://mindwell-backend-v47t.onrender.com

---

## Screenshots and Proof of Functionality

The documentation includes screenshots of:
- Application user interface in light mode
- Application user interface in dark mode
- Breathing exercise animation
- Mood tracking chart
- MongoDB database showing encrypted journal entries
- Exported JSON file containing user data

---

## Running the Project Locally

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start

## Author

Sai Krishnan  
Full Stack Developer Intern
Persevex