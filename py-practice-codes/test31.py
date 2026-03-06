import cv2
import mediapipe as mp
import winsound

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True)

cap = cv2.VideoCapture(0)

alarm_on = False

while True:
    ret, frame = cap.read()
    frame = cv2.flip(frame, 1)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    looking = False

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:

            h, w, _ = frame.shape

            left_eye = face_landmarks.landmark[33]
            right_eye = face_landmarks.landmark[263]

            lx = int(left_eye.x * w)
            ly = int(left_eye.y * h)

            rx = int(right_eye.x * w)
            ry = int(right_eye.y * h)

            cv2.circle(frame, (lx, ly), 5, (0,255,0), -1)
            cv2.circle(frame, (rx, ry), 5, (0,255,0), -1)

            center = w // 2

            if abs(lx - center) < 200 and abs(rx - center) < 200:
                looking = True

    if looking:
        text = "Looking at Screen"
        color = (0,255,0)
        alarm_on = False

    else:
        text = "Look at Screen!"
        color = (0,0,255)

        if not alarm_on:
            winsound.Beep(1000, 300)
            alarm_on = True

    cv2.putText(frame, text, (30,50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1, color, 2)

    cv2.imshow("Eye Detector", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()