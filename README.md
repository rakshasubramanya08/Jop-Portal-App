# 📄 Job Application Portal

A full-stack **Job Application Portal** built with **React (frontend)** and **Node.js + Express (backend)**.  
Applicants can enter personal details, upload CV, cover letter, other documents, and submit directly. The backend processes the data, stores files temporarily, and sends an **email notification** with attachments using Nodemailer.

---

## 🚀 Features

- 🌐 **Frontend** (React)
  - Form with applicant details (name, email, phone, date of birth, nationality, address, expected salary, earliest joining date, cover letter text).
  - File uploads: Resume, Cover Letter, Other Documents (multi-file).
  - Country dropdown for **Nationality** (auto-fetched from REST Countries API).
  - Terms & Conditions popup before submission.
  - Email preview link (when using **Ethereal test SMTP**).

- ⚙️ **Backend** (Node.js + Express)
  - Handles multipart form data with **Multer**.
  - Accepts file uploads (`cv`, `coverLetterFile`, `otherdocs`).
  - Sends email with form data + attachments using **Nodemailer**.
  - Supports **Ethereal** (testing) or real **Gmail SMTP / other providers**.

---

## 📂 Project Structure
```
│
├── backend/ # Node.js + Express server
│ ├── server.js # API logic, Multer, Nodemailer
│ ├── package.json
│ └── ...
│
├── frontend/ # React application
│ ├── src/
│ │ ├── Portal.jsx # Main Job Application form
│ │ ├── Portal.css # Styles for the form
│ │ └── App.jsx
│ ├── package.json
│ └── ...
│
└── README.md # You are here
```

---

## ⚡ Setup & Run

### 1️⃣ Clone the repo
```
git clone https://github.com/your-username/job-portal.git
cd job-portal
```

## Backend Setup
cd backend
npm install


### Create a .env file in backend/:
```
PORT=4000
EMAIL_USER=youraddress@gmail.com   # Ethereal or Gmail
EMAIL_PASS=yourapppassword         # App password (not your real Gmail password!)
```

## Run backend:
```
npm start
```

## Frontend Setup
```
cd frontend
npm install
npm run dev
```

Open in browser: http://localhost:5173

## Email Configuration

Testing mode → Uses Ethereal Email.
The server will print a Preview URL in console. Click it to see the sent email.

Production mode (Gmail) → Enable 2FA in your Google account → Generate an App Password → Put it in .env.

Example server.js email setup:
```
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```
---

