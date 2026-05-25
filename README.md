# 🤖 AI Interview Report Generator

A full-stack web application that generates personalized interview preparation reports using Google Gemini AI. Upload your resume, paste a job description, and get tailored technical questions, behavioral insights, skill gap analysis, and a day-by-day preparation roadmap.

---

## ✨ Features

- 📄 **Resume Upload** — Upload your PDF resume for AI analysis
- 🎯 **Match Score** — See how well your profile matches the job
- 💡 **Technical Questions** — Role-specific questions with model answers
- 🧠 **Behavioral Insights** — STAR-method answers tailored to your experience
- 📊 **Skill Gap Analysis** — Identify what you're missing for the role
- 🗓️ **7-Day Preparation Plan** — Actionable daily tasks to get interview-ready
- 📥 **Resume PDF Download** — AI-generated tailored resume for the job
- 🔐 **Authentication** — Secure login/register with JWT
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Frontend
| Technology | Usage |
|------------|-------|
| React.js | UI Framework |
| React Router | Client-side routing |
| SCSS | Styling |
| Axios | API calls |
| Vite | Build tool |

### Backend
| Technology | Usage |
|------------|-------|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database |
| Google Gemini AI | Report generation |
| Puppeteer | PDF generation |
| JWT + bcrypt | Authentication |
| Multer + pdf-parse | Resume file handling |


## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API key

---

### 1. Clone the repository

```bash
git clone https://github.com/Sufyan-Ali-github/ai-interview-report-generator.git
cd ai-interview-report-generator
```

---

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_API_KEY=your_gemini_api_key
```

Start the backend server:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
```

Create a `.env` file in the `Frontend/` folder:

```env
VITE_BACKEND_URL=http://localhost:3000/api
```

> ⚠️ **Note:** `VITE_BACKEND_URL` must start with `VITE_` — otherwise Vite will not expose it to the React app.
> In production, replace this with your deployed backend URL e.g. `https://your-backend.onrender.com/api`

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |

### Interview Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interview/generate-report` | Generate new report |
| GET | `/api/interview/reports` | Get all user reports |
| GET | `/api/interview/report/:interviewId` | Get report by Interview ID |
| GET | `/api/interview/resume/pdf/:interviewId` | Download tailored resume PDF |

---

## 🔑 Environment Variables

### Backend — `Backend/.env`

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Environment — `development` or `production` |
| `MONGODB_URI_KEY` | MongoDB connection string (Atlas or local) |
| `GOOGLE_API_KEY` | Google Gemini API key — [Get here](https://aistudio.google.com/app/apikey) |
| `JWT_SECRET` | Any long random secret string for JWT signing |

### Frontend — `Frontend/.env`

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Backend API base URL e.g. `http://localhost:3000/api` |

> 💡 Both folders have a `.env.example` file — copy it and fill in your values:
> ```bash
> cp Backend/.env.example Backend/.env
> cp Frontend/.env.example Frontend/.env
> ```

---

## 🖥️ Screenshots

> Dashboard — Generate Report

![Dashboard](https://github.com/Sufyan-Ali-github/ai-interview-report-generator/blob/27d91e98947fbc33960cdd503b94639e4d77a5f7/Dashboard.png)

> Interview Report — Technical Questions

![Report](https://github.com/Sufyan-Ali-github/ai-interview-report-generator/blob/c646be23204c2c1af5886af7af8801b34737d9ad/report.png)

---

## 👨‍💻 Author

**Sufyan Ali**
- GitHub: [@Sufyan-Ali-github](https://github.com/Sufyan-Ali-github)
- LinkedIn: [Sufyan Ali](https://www.linkedin.com/in/sufyan-ali-a9295228b/)
- LeetCode: [SufyanAli_99](https://leetcode.com/u/SufyanAli_99/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
