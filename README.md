# CVision - AI-Powered Interview & Recruitment Platform

CVision is an AI-driven platform that streamlines job recruitment by automating resume screening, interview preparation, and candidate-job matching. It connects freshers with recruiters based on role-specific requirements.

## Features
✅ AI-powered **resume screening** and ranking  
✅ **Personalized interview question generation**  
✅ **Real-time job matching** with AI  
✅ **Streamlit-based backend** for intelligent processing  
✅ **Next.js-based frontend** for a seamless user experience  

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
- Python 3.9+  
- pip installed  
- Google Gemini API key (if using AI features)  

### Installation & Running
```bash
cd backend
pip install -r requirements.txt
streamlit run app.py
```
The backend will be available at **`http://localhost:8501`**  

---

## Environment Variables
Create a `.env` file in both the `frontend` and `backend` directories and add the following:  

### For Frontend (`frontend/.env`):
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8501
```

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
- Pandas (for resume processing)  

---

## Contributing
Feel free to submit issues and pull requests!  

🚀 **CVision - Redefining AI-powered recruitment.**

