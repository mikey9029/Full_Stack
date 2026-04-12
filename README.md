# 🚀 PlacePro — Next-Gen Placement Management System

**PlacePro** is a professional, institutional-grade recruitment command center built on the **MERN Stack**. It serves as a high-fidelity bridge connecting ambitious student talent with global industry leaders through automated verification, AI-driven insights, and seamless recruitment workflows.

---

## 🌟 Key Features

### 👨‍🎓 For Students
*   **🧠 AI Resume Intelligence**: A privacy-locked engine that analyzes uploaded CVs to provide "Readiness Scores" and identify skill gaps for specific MNC roles.
*   **📊 Verified Academic Profiles**: Strict data integrity for academic records (CGPA 10.0 scale) ensuring institutional accuracy.
*   **🎯 Live Application Tracking**: Real-time HUD (Heads-Up Display) to monitor interview schedules and application status.

### 🛡️ For Administrators
*   **🔍 Executive Audit Suite**: Detailed profile inspection modal for deep-diving into candidate credentials.
*   **✅ Institutional Verification**: One-click student certification (`isVerified`) to signify high-potential candidates to recruiters.
*   **📧 Integrated Outreach**: Direct candidate contact via the **Brevo Email API** with professional recruitment templates.
*   **📈 Live Recruitment Pulse**: Real-time statistics tracking placements, partner companies, and active openings.

### 🏢 For Companies
*   **💼 Job Lifecycle Management**: Effortless job posting, screening, and applicant tracking.
*   **🥇 Verified Talent Access**: Priority access to "Certified" student profiles for faster domestic and international hiring.

---

## 🛠️ Technology Stack

*   **Frontend**: React.js (Vite Core), Vanilla CSS (Modern UI), Lucide Icons
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB Atlas (NoSQL)
*   **Communication**: Brevo (Sendinblue) Transactional Email API
*   **Storage**: Cloudinary (Secure Document & Media Hosting)
*   **Security**: JSON Web Tokens (JWT) & Bcrypt Encryption

---

## 🛡️ Data Integrity & Privacy Standards

PlacePro is engineered with institutional standards in mind:
1.  **CGPA Guardian**: Enforces a strict 10.0 scale across all registration and profile update workflows to prevent data errors.
2.  **Privacy Gates**: Advanced Intelligence modules remain locked until a student successfully uploads a verified CV.
3.  **Encrypted Persistence**: All sensitive user credentials are hashed and transmitted via secure, protected channels.

---

## 🚀 Installation & Setup

1️⃣ **Clone the Repository**
```bash
git clone https://github.com/mikey9029/Full_Stack.git
cd Full_Stack

2️⃣ Setup Environment Variables
Create a .env file inside the server directory:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key

3️⃣ Install Dependencies
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

4️⃣ Run the Application

# Terminal 1 (Frontend)
cd client
npm run dev

# Terminal 2 (Backend)
cd server
npm start
📌 Final Note

PlacePro is designed to replicate a real-world institutional placement ecosystem, combining data integrity, Insights, and scalable architecture to deliver a next-generation recruitment experience.
