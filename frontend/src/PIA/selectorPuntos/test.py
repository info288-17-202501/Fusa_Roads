import cv2
import numpy as np
import json

line_points = []
polygon_points = []

def select_line_and_polygon(frame):
    global line_points, polygon_points
    line_points = []
    polygon_points = []
    
    window_name = "Selecciona la línea y los puntos del polígono"
    
    def mouse_callback(event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN:
            if len(line_points) < 2:
                line_points.append((x, y))
                color = (0, 255, 0) if len(line_points) < 2 else (255, 0, 0)
                cv2.circle(frame, (x, y), 5, color, -1)
                if len(line_points) == 2:
                    cv2.line(frame, line_points[0], line_points[1], (0, 255, 0), 2)
                print((x, y))
            elif len(line_points) >= 2 and len(polygon_points) < 5:
                polygon_points.append((x, y))
                color = (0, 0, 255)
                cv2.circle(frame, (x, y), 5, color, -1)
                if len(polygon_points) > 1:
                    cv2.polylines(frame, [np.array(polygon_points)], isClosed=False, color=(255, 0, 0), thickness=2)
                print((x, y))
            cv2.imshow(window_name, frame)

    cv2.imshow(window_name, frame)
    cv2.setMouseCallback(window_name, mouse_callback)
    
    while True:
        key = cv2.waitKey(20) & 0xFF
        if len(polygon_points) >= 3 and key == 13:
            break
        elif key == 27:
            exit()
    
    cv2.destroyWindow(window_name)
    return line_points, polygon_points

def main(image_path):
    frame = cv2.imread(image_path)
    if frame is None:
        return
    print("Tamaño original de la imagen:", frame.shape)
    
    line_points, polygon_points = select_line_and_polygon(frame)
    
    print("Línea de conteo:", line_points)
    print("Puntos del polígono:", polygon_points)
    
    selection_data = {
        "line": [list(line_points[0]), list(line_points[1])],
        "polygon": [list(pt) for pt in polygon_points]
    }
    with open("line_and_polygon.json", "w") as f:
        json.dump(selection_data, f, indent=4)
    print("Información guardada en 'line_and_polygon.json'.")

if __name__ == "__main__":
    image_path = "VID_2(720P_60FPS).jpg"
    main(image_path)