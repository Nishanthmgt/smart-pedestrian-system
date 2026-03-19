import customtkinter as ctk
import cv2
from PIL import Image, ImageTk
import time
from datetime import datetime
from controller import controller
from detector import detector
from voice import voice

class SmartPedestrianGUI(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("SMART PEDESTRIAN TRAFFIC CONTROL SYSTEM // AI-CORE")
        self.geometry("1400x900")
        
        # Set theme
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")

        self.grid_columnconfigure(0, weight=3) # Video
        self.grid_columnconfigure(1, weight=1) # Controls
        self.grid_rowconfigure(0, weight=1)

        # Left Panel: Video Feed
        self.video_frame = ctk.CTkFrame(self, corner_radius=15, border_width=2, border_color="#00f3ff")
        self.video_frame.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")
        
        self.video_label = ctk.CTkLabel(self.video_frame, text="")
        self.video_label.pack(expand=True, fill="both", padx=5, pady=5)

        # Right Panel: Sidebar
        self.sidebar = ctk.CTkFrame(self, corner_radius=0, fg_color="transparent")
        self.sidebar.grid(row=0, column=1, padx=20, pady=20, sticky="nsew")

        # 1. Signal Panel
        self.signal_card = ctk.CTkFrame(self.sidebar, corner_radius=15, border_width=1, border_color="#333333")
        self.signal_card.pack(fill="x", pady=(0, 20))
        
        ctk.CTkLabel(self.signal_card, text="TRAFFIC SIGNAL ENGINE", font=("JetBrains Mono", 12, "bold"), text_color="#00f3ff").pack(pady=10)
        
        self.light_frame = ctk.CTkFrame(self.signal_card, fg_color="#1a1a1a", corner_radius=10)
        self.light_frame.pack(pady=10, padx=20, fill="x")
        
        self.red_light = ctk.CTkLabel(self.light_frame, text="●", font=("Arial", 60), text_color="#333333")
        self.red_light.pack(side="left", expand=True)
        self.green_light = ctk.CTkLabel(self.light_frame, text="●", font=("Arial", 60), text_color="#333333")
        self.green_light.pack(side="left", expand=True)

        self.mode_label = ctk.CTkLabel(self.signal_card, text="MODE: VEHICLE", font=("JetBrains Mono", 14, "bold"), text_color="#39ff14")
        self.mode_label.pack(pady=5)

        # 2. Status Panel
        self.status_card = ctk.CTkFrame(self.sidebar, corner_radius=15)
        self.status_card.pack(fill="x", pady=(0, 20))
        
        self.count_label = ctk.CTkLabel(self.status_card, text="PEDESTRIANS: 0", font=("JetBrains Mono", 16, "bold"))
        self.count_label.pack(pady=10)
        
        self.timer_label = ctk.CTkLabel(self.status_card, text="TIMER: --", font=("JetBrains Mono", 24, "bold"), text_color="#00f3ff")
        self.timer_label.pack(pady=10)

        # Camera Control
        self.cam_ctrl = ctk.CTkFrame(self.sidebar, corner_radius=15)
        self.cam_ctrl.pack(fill="x", pady=(0, 20))
        
        self.cam_var = ctk.StringVar(value="0")
        self.cam_select = ctk.CTkOptionMenu(self.cam_ctrl, values=["0", "1", "2"], 
                                          command=self.change_camera,
                                          variable=self.cam_var)
        self.cam_select.pack(pady=10, padx=20)
        
        ctk.CTkButton(self.cam_ctrl, text="SYNC CAMERA", command=self.sync_camera, 
                      fg_color="#00f3ff", text_color="black", font=("JetBrains Mono", 12, "bold")).pack(pady=(0, 10), padx=20)

        # 3. History Panel
        self.history_card = ctk.CTkFrame(self.sidebar, corner_radius=15)
        self.history_card.pack(fill="both", expand=True)
        
        ctk.CTkLabel(self.history_card, text="CROSSING_HISTORY", font=("JetBrains Mono", 12, "bold"), text_color="#00f3ff").pack(pady=10)
        
        self.history_box = ctk.CTkTextbox(self.history_card, font=("JetBrains Mono", 10), state="disabled", fg_color="#0a0a0f")
        self.history_box.pack(fill="both", expand=True, padx=10, pady=10)

        # Camera
        self.current_cam_index = 0
        self.cap = cv2.VideoCapture(self.current_cam_index)
        self.update_gui()

    def change_camera(self, choice):
        self.current_cam_index = int(choice)
        self.sync_camera()

    def sync_camera(self):
        if self.cap.isOpened():
            self.cap.release()
        self.cap = cv2.VideoCapture(self.current_cam_index)

    def update_gui(self):
        ret, frame = self.cap.read()
        if ret:
            # 1. AI Detection
            detections = detector.detect(frame)
            count = len(detections)
            
            # 2. Update Logic
            controller.update(count)
            status = controller.get_status()
            
            # 3. Draw HUD on Frame
            frame = detector.draw_detections(frame, detections)
            
            # 4. Voice Alerts
            if status['mode'] == 'PEDESTRIAN':
                if status['timer'] <= 5 and status['timer'] > 0:
                    voice.speak(str(status['timer']))
                elif status['timer'] == 0:
                    voice.speak("Stop walking")
            else:
                voice.reset()

            # 5. Update GUI Elements
            self.count_label.configure(text=f"PEDESTRIANS: {count}", text_color="#bc13fe" if count >= 3 else "#ffffff")
            self.timer_label.configure(text=f"TIMER: {status['timer']}s" if status['mode'] == 'PEDESTRIAN' else "TIMER: --")
            
            if status['mode'] == 'VEHICLE':
                self.mode_label.configure(text="MODE: VEHICLE", text_color="#39ff14")
                self.red_light.configure(text_color="#333333")
                self.green_light.configure(text_color="#39ff14")
            else:
                self.mode_label.configure(text="MODE: PEDESTRIAN", text_color="#00f3ff")
                self.red_light.configure(text_color="#ff003c")
                self.green_light.configure(text_color="#333333")

            # Update History if just crossed
            # (Note: For simplicity, we check transition in gui or controller)
            if hasattr(self, 'last_mode') and self.last_mode == 'PEDESTRIAN' and status['mode'] == 'VEHICLE':
                log_entry = f"[{datetime.now().strftime('%H:%M:%S')}] CROSSING COMPLETED (ID_{int(time.time())%1000})\n"
                self.history_box.configure(state="normal")
                self.history_box.insert("0.0", log_entry)
                self.history_box.configure(state="disabled")
            
            self.last_mode = status['mode']

            # Convert frame to PIL for CTk
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(frame)
            # Resize while maintaining aspect ratio
            img = img.resize((900, 600), Image.Resampling.LANCZOS)
            img_tk = ImageTk.PhotoImage(img)
            self.video_label.configure(image=img_tk)
            self.video_label._image = img_tk # Keep reference

        self.after(20, self.update_gui)

    def on_closing(self):
        self.cap.release()
        self.destroy()

if __name__ == "__main__":
    app = SmartPedestrianGUI()
    app.protocol("WM_DELETE_WINDOW", app.on_closing)
    app.mainloop()
