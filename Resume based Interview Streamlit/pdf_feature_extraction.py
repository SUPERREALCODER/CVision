import os
import json
import re
import whisper
import torch
import streamlit as st
import sounddevice as sd
import numpy as np
import tempfile
from scipy.io.wavfile import write
from PyPDF2 import PdfReader
import google.generativeai as genai
from difflib import SequenceMatcher

# Configure Gemini API
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GENAI_API_KEY:
    st.error("Missing Gemini API key. Set it as an environment variable.")
genai.configure(api_key=GENAI_API_KEY)

# Load Whisper Model (on-device)
device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("base").to(device)

# Dictionary to store user responses
if "user_responses" not in st.session_state:
    st.session_state.user_responses = {}

def extract_text_from_pdf(pdf_file):
    """Extract text from a PDF file."""
    try:
        reader = PdfReader(pdf_file)
        return "".join(page.extract_text() or "" for page in reader.pages)
    except Exception as e:
        st.error(f"Error processing PDF: {e}")
        return None

def extract_json(response_text):
    """Extracts valid JSON from a response using regex."""
    match = re.search(r'\{.*\}|\[.*\]', response_text, re.DOTALL)
    return json.loads(match.group(0)) if match else None

def analyze_resume_with_gemini(text, max_chars=10000):
    """Analyzes resume and extracts key details."""
    prompt = f"""
    Extract key details from the resume in strict JSON format:
    {{
        "domain": "Extracted domain",
        "skills": ["Top Skill 1", "Top Skill 2", "Top Skill 3", "Top Skill 4", "Top Skill 5"],
        "work_experience": "Experience level description",
        "strength": "One strong point from the resume",
        "weakness": "One weak point from the resume that you think can get better"
    }}
    Resume Content:
    {text[:max_chars]}
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-flash-8b")
        response = model.generate_content(prompt)
        return extract_json(response.text.strip())
    except Exception as e:
        st.error(f"Gemini API error: {e}")
        return None

def generate_interview_questions(resume_data):
    """Generates interview questions with correct answers."""
    prompt = f"""
    Generate 5 interview questions based on the resume. Provide correct answers as well.
    Resume Data:
    {json.dumps(resume_data, indent=4)}
    
    Response Format:
    [
        {{"id": 1, "question": "Question 1", "answer": "Correct answer 1"}},
        {{"id": 2, "question": "Question 2", "answer": "Correct answer 2"}},
        {{"id": 3, "question": "Question 3", "answer": "Correct answer 3"}},
        {{"id": 4, "question": "Question 4", "answer": "Correct answer 4"}},
        {{"id": 5, "question": "Question 5", "answer": "Correct answer 5"}}
    ]
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-flash-8b")
        response = model.generate_content(prompt)
        return extract_json(response.text.strip())
    except Exception as e:
        st.error(f"Gemini API error: {e}")
        return None

def record_audio(duration=15, sample_rate=44100):
    """Records audio from the microphone and saves it as a temporary file.
    
    Increased recording time to 15 seconds.
    """
    st.write("🎤 Recording... Speak now!")
    audio_data = sd.rec(int(sample_rate * duration), samplerate=sample_rate, channels=1, dtype=np.int16)
    sd.wait()
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        write(temp_audio.name, sample_rate, audio_data)
        return temp_audio.name

def transcribe_audio(audio_file):
    """Convert recorded audio to text using Whisper (on-device)."""
    try:
        result = model.transcribe(audio_file)
        return result["text"]
    except Exception as e:
        st.error(f"Audio transcription error: {e}")
        return None

def evaluate_responses(user_responses, correct_answers):
    """Compares user responses with correct answers and rates them using text similarity."""
    score = 0
    feedback = []

    for q in correct_answers:
        question_id = q["id"]
        correct_answer = q["answer"]
        user_answer = user_responses.get(question_id, "")

        # Use SequenceMatcher to compute a similarity ratio (0 to 1)
        similarity = SequenceMatcher(None, correct_answer, user_answer).ratio()
        # Map similarity to a score out of 2
        question_score = round(similarity * 2, 2)
        score += question_score

        feedback.append({
            "question": q["question"],
            "user_answer": user_answer,
            "correct_answer": correct_answer,
            "similarity_percent": round(similarity * 100, 2),
            "score": question_score
        })

    # Normalize final score out of 10
    final_score = (score / (len(correct_answers) * 2)) * 10
    return round(final_score, 2), feedback
# Streamlit UI
st.title("AI-Powered Resume Interview (Offline Whisper)")

uploaded_file = st.file_uploader("Upload Resume (PDF)", type=["pdf"])
if uploaded_file:
    with st.spinner("Processing..."):
        extracted_text = extract_text_from_pdf(uploaded_file)
        if extracted_text:
            resume_data = analyze_resume_with_gemini(extracted_text)
            if resume_data:
                st.subheader("Extracted Resume Information")
                st.json(resume_data)

                interview_questions = generate_interview_questions(resume_data)
                if interview_questions:
                    st.subheader("Interview Questions")
                    
                    for q in interview_questions:
                        st.write(f"**Q{q['id']}: {q['question']}**")
                        if st.button(f"Record Answer for Q{q['id']}", key=f"record_{q['id']}"):
                            audio_file = record_audio()
                            transcript = transcribe_audio(audio_file)
                            if transcript:
                                st.session_state.user_responses[q["id"]] = transcript
                                st.success(f"Answer recorded:\n\n{transcript}")

                    # Check if responses for all questions have been recorded
                    if len(st.session_state.user_responses) == 5 and st.button("Submit Responses"):
                        st.subheader("Evaluation")
                        final_score, feedback = evaluate_responses(st.session_state.user_responses, interview_questions)
                        st.write(f"**Final Score:** {final_score}/10")
                        st.markdown("---")
                        for item in feedback:
                            st.markdown(f"**Question:** {item['question']}")
                            st.markdown(f"**Your Answer:** {item['user_answer']}")
                            st.markdown(f"**Correct Answer:** {item['correct_answer']}")
                            st.markdown(f"**Score for this question:** {item['score']}/2")
                            st.markdown("---")    
