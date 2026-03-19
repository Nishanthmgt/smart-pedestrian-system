import pyttsx3
import threading

class VoiceEngine:
    def __init__(self):
        self.engine = pyttsx3.init()
        # Set property for AI-like voice
        voices = self.engine.getProperty('voices')
        if len(voices) > 0:
            self.engine.setProperty('voice', voices[0].id) # Default male/female
        self.engine.setProperty('rate', 160)
        self.engine.setProperty('volume', 1.0)
        self.last_spoken = None

    def _speak_worker(self, text):
        self.engine.say(text)
        self.engine.runAndWait()

    def speak(self, text):
        if text == self.last_spoken:
            return
        
        self.last_spoken = text
        # Run speech in a separate thread so it doesn't block the GUI/Video
        threading.Thread(target=self._speak_worker, args=(text,), daemon=True).start()

    def reset(self):
        self.last_spoken = None

# Singleton instance
voice = VoiceEngine()
