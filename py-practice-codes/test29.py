import cv2
import mediapipe as mp
import pygame
import time
import sys

# 1. Initialize Pygame Community Edition
pygame.init()
pygame.mixer.init()

# Setup your alert sound (Must be in the same folder as this script)
# If you don't have a file, you can download a sample .wav or .ogg
try:
    alert_sound = pygame.mixer.Sound("alert.wav")
except:
    print("Warning: 'alert.wav' not found. Please place a sound file in this folder.")
    alert_sound = None

# 2. Setup MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
# Using refine_landmarks=True helps track eye movement more accurately
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True, 
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6
)

# 3. Camera Setup
cap = cv2.VideoCapture(0)
is_alerting = False

print("Focus Tracker Started. Press 'ESC' to exit.")

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("Ignoring empty camera frame.")
        continue

    # Mirror the image for a more natural view
    frame = cv2.flip(frame, 1)
    
    # Convert BGR (OpenCV default) to RGB (MediaPipe requirement)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    focused = False

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            # We compare the Nose Tip (Landmark 1) to the Face Edges
            # to see if the head is rotated.
            nose = face_landmarks.landmark[1]
            left_cheek = face_landmarks.landmark[234]
            right_cheek = face_landmarks.landmark[454]
            
            # Normalizing the nose position between 0 and 1
            # 0.5 is perfectly centered looking at the screen.
            relative_pos = (nose.x - left_cheek.x) / (right_cheek.x - left_cheek.x)

            # Adjust these thresholds if the alarm is too sensitive
            if 0.38 < relative_pos < 0.62:
                focused = True

    # 4. Sound & UI Logic
    if not focused:
        if not is_alerting and alert_sound:
            alert_sound.play(loops=-1)
            is_alerting = True
        
        # Red Overlay Text
        cv2.putText(frame, "EYES ON SCREEN!", (50, 80), 
                    cv2.FONT_HERSHEY_DUPLEX, 1.2, (0, 0, 255), 2)
        # Draw a red border around the frame
        cv2.rectangle(frame, (0,0), (frame.shape[1], frame.shape[0]), (0,0,255), 20)
    
    else:
        if is_alerting and alert_sound:
            alert_sound.stop()
            is_alerting = False
        
        cv2.putText(frame, "Focus Level: OK", (50, 80), 
                    cv2.FONT_HERSHEY_DUPLEX, 1.2, (0, 255, 0), 2)

    # 5. Show Display
    cv2.imshow('CSE AI/ML Focus Guard', frame)

    # Break loop on ESC key
    if cv2.waitKey(5) & 0xFF == 27:
        break

# Cleanup
cap.release()
cv2.destroyAllWindows()
if alert_sound:
    alert_sound.stop()
pygame.quit()
sys.exit()