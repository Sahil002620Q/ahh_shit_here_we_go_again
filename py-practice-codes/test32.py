import cv2
import mediapipe as mp
import pygame

# initialize sound
pygame.mixer.init()
pygame.mixer.music.load("alert.mp3")

mp_face = mp.solutions.face_mesh
face_mesh = mp_face.FaceMesh()

cap = cv2.VideoCapture(0)

def play_alert():
    if not pygame.mixer.music.get_busy():
        pygame.mixer.music.play(-1)

def stop_alert():
    pygame.mixer.music.stop()

while True:
    ret, frame = cap.read()
    frame = cv2.flip(frame, 1)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = face_mesh.process(rgb)

    looking = False

    if result.multi_face_landmarks:
        for face_landmarks in result.multi_face_landmarks:

            # nose landmark (used as rough direction indicator)
            nose = face_landmarks.landmark[1]

            x = nose.x
            y = nose.y

            if 0.4 < x < 0.6 and 0.4 < y < 0.6:
                looking = True

    if looking:
        stop_alert()
        text = "Looking at screen"
    else:
        play_alert()
        text = "Look at screen!"

    cv2.putText(frame, text, (50,50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,(0,255,0),2)

    cv2.imshow("Attention Monitor", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()