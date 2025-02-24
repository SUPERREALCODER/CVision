from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import base64
import numpy as np
from deepface import DeepFace
from collections import deque
import time

app = Flask(__name__)
CORS(app)  # Allow frontend requests

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
stress_emotions = ['angry', 'sad', 'fear', 'surprise']
emotion_buffer = deque(maxlen=10)

multi_face_start_time = None  # Timer for multi-face detection
no_face_start_time = None  # Timer for no-face detection
WARNING_THRESHOLD = 5  # Number of seconds before triggering warning

@app.route('/analyze_emotion', methods=['POST'])
def analyze_emotion():
    global multi_face_start_time, no_face_start_time

    try:
        data = request.json
        image_data = data.get("image")

        if not image_data:
            return jsonify({"error": "No image data received"}), 400

        # Decode base64 image
        img_bytes = base64.b64decode(image_data)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Convert to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(50, 50))

        warning_message = None

        # If no face detected
        if len(faces) == 0:
            if no_face_start_time is None:
                no_face_start_time = time.time()

            elapsed_time = time.time() - no_face_start_time
            if elapsed_time >= WARNING_THRESHOLD:
                warning_message = "No face detected for 5 seconds!"
        else:
            no_face_start_time = None  # Reset timer if face is detected

        # Multi-face detection logic
        if len(faces) > 1:
            if multi_face_start_time is None:
                multi_face_start_time = time.time()

            elapsed_time = time.time() - multi_face_start_time
            if elapsed_time >= WARNING_THRESHOLD:
                warning_message = "Multiple faces detected for 5 seconds!"
        else:
            multi_face_start_time = None  # Reset timer if only one face is detected

        # Return warning message immediately
        if warning_message:
            return jsonify({"warning": warning_message, "status": "error"})

        results = []
        for (x, y, w, h) in faces:
            face_roi = frame[y:y+h, x:x+w]

            try:
                predictions = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)
                detected_emotion = predictions[0]['dominant_emotion']
                confidence = predictions[0]['emotion'][detected_emotion]

                if confidence > 60:
                    emotion_buffer.append(detected_emotion)

                stable_emotion = max(set(emotion_buffer), key=emotion_buffer.count) if emotion_buffer else "neutral"
                stress_status = "STRESSED" if stable_emotion in stress_emotions else "Calm"

                results.append({
                    "emotion": stable_emotion,
                    "stress": stress_status,
                    "bounding_box": {
                        "x": int(x),
                        "y": int(y),
                        "w": int(w),
                        "h": int(h)
                    }
                })

                print("Result:- ", results)

            except Exception as e:
                print("DeepFace Error:", e)

        return jsonify({"results": results})

    except Exception as e:
        print("Server Error:", e)
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
