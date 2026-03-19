import time

class TrafficController:
    PEDESTRIAN_TRIGGER_COUNT = 3
    PEDESTRIAN_TRIGGER_WAIT_S = 3
    PEDESTRIAN_CROSSING_TIME_S = 15

    def __init__(self):
        self.mode = 'VEHICLE' # 'VEHICLE' or 'PEDESTRIAN'
        self.timer = 0
        self.waiting_since = 0
        self.is_waiting = False
        self.pedestrian_count = 0

    def update(self, count):
        self.pedestrian_count = count
        now = time.time()

        if self.mode == 'VEHICLE':
            if count >= self.PEDESTRIAN_TRIGGER_COUNT:
                if not self.is_waiting:
                    self.is_waiting = True
                    self.waiting_since = now
                elif now - self.waiting_since >= self.PEDESTRIAN_TRIGGER_WAIT_S:
                    self.trigger_pedestrian_mode()
            else:
                self.is_waiting = False
                self.waiting_since = 0
        
        elif self.mode == 'PEDESTRIAN':
            elapsed = now - self.crossing_started_at
            self.timer = max(0, int(self.PEDESTRIAN_CROSSING_TIME_S - elapsed))
            if self.timer <= 0:
                self.mode = 'VEHICLE'
                self.is_waiting = False
                self.timer = 0

    def trigger_pedestrian_mode(self):
        self.mode = 'PEDESTRIAN'
        self.crossing_started_at = time.time()
        self.timer = self.PEDESTRIAN_CROSSING_TIME_S
        self.is_waiting = False

    def get_status(self):
        return {
            'mode': self.mode,
            'timer': self.timer,
            'is_waiting': self.is_waiting,
            'count': self.pedestrian_count
        }

# Singleton
controller = TrafficController()
