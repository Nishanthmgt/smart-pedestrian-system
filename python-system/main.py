from gui import SmartPedestrianGUI

def main():
    """
    Main entry point for the Smart Pedestrian Traffic Control System.
    """
    print("--- SMART PEDESTRIAN TRAFFIC CONTROL SYSTEM ---")
    print("--- [AI-CORE INITIALIZING...] ---")
    
    try:
        app = SmartPedestrianGUI()
        app.protocol("WM_DELETE_WINDOW", app.on_closing)
        app.mainloop()
    except Exception as e:
        print(f"CRITICAL SYSTEM ERROR: {e}")
    finally:
        print("--- [SYSTEM SHUTDOWN] ---")

if __name__ == "__main__":
    main()
