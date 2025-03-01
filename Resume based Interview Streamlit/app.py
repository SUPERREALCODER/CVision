import cv2
import dlib
import numpy as np
from scipy.spatial import distance
from deepface import DeepFace
from collections import deque

# Load face detector and facial landmark predictor
landmark_model_path = r"shape_predictor_68_face_landmarks.dat"  # Update this path!
landmark_predictor = dlib.shape_predictor(landmark_model_path)

# Open webcam
cap = cv2.VideoCapture(0)

# Define stress-related emotions
stress_emotions = ['angry', 'sad', 'fear', 'surprise']

# Store last 10 detected emotions for smoothing
emotion_buffer = deque(maxlen=10)

# Eye aspect ratio (EAR) threshold for blink detection
EAR_THRESHOLD = 0.25  # Increase from 0.2
BLINK_CONSEC_FRAMES = 2  # Reduce consecutive frame requirement
blink_counter = 0
blink_rate = 0
blink_timestamps = []

# Function to calculate EAR
def calculate_ear(eye):
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])
    ear = (A + B) / (2.0 * C)
    return ear

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # Convert frame to grayscale for face detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Detect faces
    faces = face_detector(gray)
    
    for face in faces:
        landmarks = landmark_predictor(gray, face)
        
        # Extract eye coordinates
        left_eye = [(landmarks.part(i).x, landmarks.part(i).y) for i in range(36, 42)]
        right_eye = [(landmarks.part(i).x, landmarks.part(i).y) for i in range(42, 48)]
        
        # Compute EAR for both eyes
        left_ear = calculate_ear(left_eye)
        right_ear = calculate_ear(right_eye)
        avg_ear = (left_ear + right_ear) / 2.0
        
        # Blink detection
        if avg_ear < EAR_THRESHOLD:
            blink_counter += 1
        else:
            if blink_counter >= BLINK_CONSEC_FRAMES:
                blink_timestamps.append(cv2.getTickCount())
                blink_rate = len(blink_timestamps) / (cv2.getTickFrequency() / 60)
            blink_counter = 0
        
        # Draw eye rectangles
        for (x, y) in left_eye + right_eye:
            cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)
        
        # Extract face region for emotion detection
        x, y, w, h = face.left(), face.top(), face.width(), face.height()
        face_roi = frame[y:y+h, x:x+w]
        
        try:
            # Analyze emotions using only the detected face
            predictions = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)
            detected_emotion = predictions[0]['dominant_emotion']
            confidence = predictions[0]['emotion'][detected_emotion]
            
            if confidence > 60:
                emotion_buffer.append(detected_emotion)
            
            if emotion_buffer:
                stable_emotion = max(set(emotion_buffer), key=emotion_buffer.count)
            else:
                stable_emotion = "neutral"
            
            # Determine if the person might be stressed
            stress_status = "STRESSED" if stable_emotion in stress_emotions or blink_rate > 20 else "Calm"
            color = (0, 0, 255) if stress_status == "STRESSED" else (0, 255, 0)

            # Display results
            cv2.putText(frame, f'Emotion: {stable_emotion}', (x, y - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
            cv2.putText(frame, f'Stress: {stress_status}', (x, y - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
            cv2.putText(frame, f'Blink Rate: {blink_rate:.2f}/min', (x, y + h + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 0), 2)

        except Exception as e:
            print("Error:", e)
    
    cv2.imshow('Emotion & Stress Detection', frame)
    
    # Press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()