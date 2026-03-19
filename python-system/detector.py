import cv2
from ultralytics import YOLO

class PedestrianDetector:
    def __init__(self, model_path='yolov8n.pt'):
        # This will automatically download the model if not found
        self.model = YOLO(model_path)
        self.classes = self.model.names

    def detect(self, frame):
        # Run YOLOv8 inference 
        # stream=True for memory efficiency in loops
        results = self.model(frame, classes=[0], conf=0.4, verbose=False) # class 0 is 'person'
        
        detections = []
        for r in results:
            boxes = r.boxes
            for box in boxes:
                # Get coordinates
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                
                # Confidence
                conf = round(float(box.conf[0]) * 100, 1)
                
                detections.append({
                    'bbox': (x1, y1, x2, y2),
                    'conf': conf,
                    'class': 'person'
                })
        
        return detections

    def draw_detections(self, frame, detections):
        # Draw futuristic neon-blue bounding boxes
        for det in detections:
            x1, y1, x2, y2 = det['bbox']
            conf = det['conf']
            
            # Neon Blue #00f3ff is approx (255, 243, 0) in BGR
            color = (255, 243, 0) 
            
            # Main rectangle
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            
            # Corner accents
            length = 20
            # Top-left
            cv2.line(frame, (x1, y1), (x1+length, y1), color, 4)
            cv2.line(frame, (x1, y1), (x1, y1+length), color, 4)
            # Top-right
            cv2.line(frame, (x2, y1), (x2-length, y1), color, 4)
            cv2.line(frame, (x2, y1), (x2, y1+length), color, 4)
            # Bottom-left
            cv2.line(frame, (x1, y2), (x1+length, y2), color, 4)
            cv2.line(frame, (x1, y2), (x1, y2-length), color, 4)
            # Bottom-right
            cv2.line(frame, (x2, y2), (x2-length, y2), color, 4)
            cv2.line(frame, (x2, y2), (x2, y2-length), color, 4)

            # Label
            label = f"PEDESTRIAN {conf}%"
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
            
        return frame

# Singleton
detector = PedestrianDetector()
