# CVision - AI-Powered Interview & Recruitment Platform

CVision is an AI-driven platform that streamlines job recruitment by automating resume screening, interview preparation, and candidate-job matching. It connects freshers with recruiters based on role-specific requirements.

## Features
✅ AI-powered **resume screening** and ranking  
✅ **Personalized interview question generation**  
✅ **Real-time job matching** with AI  
✅ **Streamlit-based backend** for intelligent processing  
✅ **Next.js-based frontend** for a seamless user experience  
✅ **Face detection for interview security**  

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/CVision.git
cd CVision
```

---

## Frontend Setup (Next.js + TypeScript)

### Prerequisites
- Node.js (v18+ recommended)  
- npm or yarn installed  

### Installation & Running
```bash
cd frontend
npm install  # or yarn install
npm run dev  # or yarn dev
```
The site will be available at **`http://localhost:3000`**  

---

## Backend Setup (Streamlit + Python)

### Prerequisites
- Python 3.10.14+  
- pip installed  
- Google Gemini API key (if using AI features)  

### Installation & Running
#### **For Face Detection Interview Test (Camera Security Features)**
```bash
cd backend/Face-Detection-Interview-Test
streamlit run app.py
```

#### **For Resume-Based Interview (AI-driven Questions & Matching)**
```bash
cd backend/Resume-Based-Interview-Streamlit
streamlit run app.py
```

#### **For Recruiter Automation (AI-driven Candidate Selection)**
```bash
cd backend/Recruiter-Automation
streamlit run app.py
```

The backend will be available at **`http://localhost:8501`**  

---

## Environment Variables
Create a `.env` file in both the `frontend` and `backend` directories and add the following:  
### For Backend (`backend/.env`):
```env
GEMINI_API_KEY=your_api_key_here
```

---

## Tech Stack
### Frontend (Next.js + TypeScript)
- Next.js  
- TypeScript  
- Tailwind CSS  
- API integration  

### Backend (Streamlit + Python)
- Streamlit  
- Google Gemini API   
- OpenCV (for face detection security)  

---

## Contributing
Feel free to submit issues and pull requests!  

🚀 **CVision - Redefining AI-powered recruitment.**

