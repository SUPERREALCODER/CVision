import os
import json
import re
import shutil
import smtplib
import pandas as pd
import streamlit as st
import PyPDF2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sentence_transformers import SentenceTransformer, util

# Create necessary folders
os.makedirs("resumes", exist_ok=True)
os.makedirs("output", exist_ok=True)

# Load NLP model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Streamlit UI
st.title("📄 Resume Scanner & Automated Interview Email")
st.write("Upload resumes (PDF), rank them, and send interview emails automatically!")

# User Input for Ideal Resume
ideal_resume_text = st.text_area("📝 Enter Ideal Resume Description", 
                                 "Enter the text of your ideal resume here. The AI will compare each uploaded resume against this.")

# Email Sending Details
sender_email = st.text_input("📧 Enter Your Email (Gmail)", "")
sender_password = st.text_input("🔑 Enter Your Email Password", "", type="password")
interview_date = st.date_input("📅 Select Interview Date")
interview_time = st.time_input("⏰ Select Interview Time")
meeting_link = st.text_input("🔗 Enter Interview Meeting Link", "https://meet.google.com/your-meeting-id")

# File uploader
uploaded_files = st.file_uploader("📂 Upload Resumes (PDF)", type=["pdf"], accept_multiple_files=True)

# Save uploaded resumes
if uploaded_files:
    for uploaded_file in uploaded_files:
        file_path = os.path.join("resumes", uploaded_file.name)
        with open(file_path, "wb") as f:
            f.write(uploaded_file.getbuffer())

    st.success(f"✅ {len(uploaded_files)} resumes uploaded successfully!")

# Function to extract text from PDFs
def extract_text_from_pdf(pdf_path):
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text = " ".join([page.extract_text() for page in reader.pages if page.extract_text()])
    return text

# Function to extract email addresses
def extract_email(text):
    email_pattern = r"[a-zA-Z0-9._%+-]+@gmail\.com"
    emails = re.findall(email_pattern, text)
    return emails[0] if emails else "No Gmail Found"

# Function to process and rank resumes
def extract_and_rank(ideal_text, top_n=10):
    resume_scores = []

    for filename in os.listdir("resumes"):
        if filename.endswith(".pdf"):
            file_path = os.path.join("resumes", filename)
            text = extract_text_from_pdf(file_path)

            # Calculate similarity
            ideal_embedding = model.encode(ideal_text, convert_to_tensor=True)
            resume_embedding = model.encode(text, convert_to_tensor=True)
            similarity_score = util.pytorch_cos_sim(ideal_embedding, resume_embedding).item()

            # Extract email
            email = extract_email(text)

            resume_scores.append({
                "filename": filename,
                "similarity_score": round(similarity_score, 2),
                "email": email
            })

    # Sort by similarity score (highest first) & pick top N resumes
    resume_scores.sort(key=lambda x: x["similarity_score"], reverse=True)
    selected_resumes = resume_scores[:top_n]  # Pick only the top 10

    # Copy selected resumes to output folder
    for resume in selected_resumes:
        shutil.copy(os.path.join("resumes", resume["filename"]), os.path.join("output", resume["filename"]))

    return selected_resumes

# Analyze resumes button
if st.button("🔍 Analyze Resumes"):
    if not ideal_resume_text.strip():
        st.error("❌ Please enter an ideal resume description before analyzing!")
    elif not uploaded_files:
        st.error("❌ Please upload resumes before analyzing!")
    else:
        with st.spinner("Processing resumes..."):
            top_resumes = extract_and_rank(ideal_resume_text)

            if not top_resumes:
                st.error("❌ No resumes found!")
            else:
                st.success(f"✅ {len(top_resumes)} resumes ranked successfully!")
                df = pd.DataFrame(top_resumes)
                st.dataframe(df)

                json_path = "output/selected_resumes.json"
                with open(json_path, "w", encoding="utf-8") as json_file:
                    json.dump(top_resumes, json_file, indent=4)

                csv_path = "output/selected_resumes.csv"
                df.to_csv(csv_path, index=False, encoding="utf-8")

                st.download_button("📥 Download JSON", open(json_path, "rb"), file_name="selected_resumes.json", mime="application/json")
                st.download_button("📥 Download CSV", open(csv_path, "rb"), file_name="selected_resumes.csv", mime="text/csv")

# Email Sending Function
def send_email(receiver_email):
    """Sends interview invitation email."""
    try:
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = receiver_email
        msg["Subject"] = "Interview Invitation"

        body = f"""
        Dear Candidate,

        Congratulations! You have been shortlisted for an interview.

        📅 **Date:** {interview_date}  
        ⏰ **Time:** {interview_time}  
        🔗 **Meeting Link:** {meeting_link}

        Please confirm your availability by replying to this email.

        Best regards,  
        Recruitment Team
        """

        msg.attach(MIMEText(body, "plain"))

        # Connect to SMTP Server
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()
        
        return f"✅ Email sent to {receiver_email}"
    
    except Exception as e:
        return f"❌ Failed to send email to {receiver_email}: {str(e)}"

# Send Emails Button
if st.button("📩 Send Interview Emails"):
    if not sender_email or not sender_password:
        st.error("❌ Please enter your email and password to send emails.")
    else:
        with st.spinner("Sending emails..."):
            top_resumes = extract_and_rank(ideal_resume_text)  # Store result to prevent extra processing
            st.write(f"📊 Sending emails to {len(top_resumes)} candidates...")
            sent_status = []
            for resume in top_resumes:
                if resume["email"] != "No Gmail Found":
                    result = send_email(resume["email"])
                    sent_status.append(result)
            for status in sent_status:
                st.write(status)
