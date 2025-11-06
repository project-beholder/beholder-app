import json
import cv2 
from pathlib import Path

# Sample image resolution
RES_X = 320
RES_Y = 180 

# Path to save camera frame
img_path = Path.cwd() / "frame.jpg"

# Setup ArUco 
aruco_dict = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_250)
parameters = cv2.aruco.DetectorParameters()
detector = cv2.aruco.ArucoDetector(aruco_dict, parameters)

# Helper function to draw markers
def draw_marker(frame, m_dict):
    # Draw the marker boundary 
    for i in range(4):
        cv2.line(frame, m_dict["corners"][i], m_dict["corners"][(i+1)%4], (196, 72, 251), 10)

    # Draw circle around first point 
    cv2.circle(frame, m_dict["corners"][0], 6, (196, 72, 251), 2)

    # Add ID Text
    cv2.putText(frame, f'ID:{m_dict["id"]}', m_dict["corners"][0], cv2.FONT_HERSHEY_PLAIN, 6, (0, 0, 255), 8, cv2.LINE_8)

# Start camera stream 
cap_id = 0
video_capture = cv2.VideoCapture(cap_id)

while True:
    # Obtain video stream command 
    command = input()

    # Split command [Change video stream | New video stream | Send image to frontend | Flip image]
    chg_stream = int(command[0:1])
    cap_id = int(command[1:2])
    send_img = int(command[2:3])
    flip_img = int(command[3:4])

    if chg_stream:
        # Update video stream to new cap ID
        video_capture.release()
        video_capture = cv2.VideoCapture(cap_id)
    
    ret, frame = video_capture.read()
    if not ret:
        print("Could not grab video feed")
        continue

    if flip_img:
        flip = cv2.flip(frame, 1)
        frame = flip.copy()

    # Detect markers
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    corners, ids, rejected = detector.detectMarkers(gray)

    marker_list = []

    if ids is not None:
        # Draw markers
        # cv2.aruco.drawDetectedMarkers(frame, corners, ids, bordercolor=(196, 72, 251))

        # Create marker list
        for id, corner in zip(ids, corners):
            pts = corner[0].astype(int).tolist()
            
            m_dict = {}
            m_dict["id"] = id[0].item()
            m_dict["corners"] = pts

            # Draw the marker
            draw_marker(frame, m_dict)

            marker_list.append(m_dict)

    marker_json = {}
    marker_json["markers"] = marker_list

    if send_img:
        resized = cv2.resize(frame, (RES_X, RES_Y), cv2.INTER_LINEAR)
        cv2.imwrite(img_path, resized)

        marker_json["type"] = "img-done"

        # print(json.dumps({"type" : "img-done"}), end='')

    print(json.dumps(marker_json), end='')
  
