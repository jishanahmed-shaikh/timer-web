class TimerApp {
    constructor() {
        this.timerDisplay = document.querySelector('.timer-display');
        this.minutesInput = document.getElementById('minutes-input');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.progressBar = document.querySelector('.progress-bar');
        this.timerSetSound = document.getElementById('timer-set-sound');
        this.timeUpSound = document.getElementById('time-up-sound');

        this.isRunning = false;
        this.isPaused = false;
        this.remainingTime = 0;
        this.totalTime = 0;
        this.timerId = null;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseResumeTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.minutesInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startTimer();
        });
    }

    startTimer() {
        const minutes = parseInt(this.minutesInput.value);
        if (!minutes || minutes <= 0) {
            this.showErrorFeedback();
            return;
        }

        this.remainingTime = minutes * 60;
        this.totalTime = this.remainingTime;
        this.isRunning = true;
        this.isPaused = false;

        this.timerSetSound.play();
        this.updateButtonStates();
        this.minutesInput.disabled = true;
        
        this.updateTimer();
    }

    updateTimer() {
        if (this.timerId) clearInterval(this.timerId);
        
        this.timerId = setInterval(() => {
            if (!this.isPaused) {
                if (this.remainingTime <= 0) {
                    this.timerComplete();
                    return;
                }

                this.remainingTime--;
                this.updateDisplay();
                this.updateProgress();

                if (this.remainingTime < 10) {
                    this.timerDisplay.style.color = 
                        this.remainingTime % 2 ? '#FF3366' : '#00FF95';
                }
            }
        }, 1000);
    }

    pauseResumeTimer() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? 'RESUME' : 'PAUSE';
    }

    resetTimer() {
        if (this.timerId) clearInterval(this.timerId);
        this.isRunning = false;
        this.isPaused = false;
        this.remainingTime = 0;
        this.totalTime = 0;
        
        this.minutesInput.value = '';
        this.minutesInput.disabled = false;
        this.timerDisplay.textContent = '00:00';
        this.timerDisplay.style.color = '#00FF95';
        this.progressBar.style.width = '0%';
        this.pauseBtn.textContent = 'PAUSE'; // Reset the pause button text
        
        this.updateButtonStates();
        this.minutesInput.focus();
    }    

    updateButtonStates() {
        this.startBtn.disabled = this.isRunning;
        this.pauseBtn.disabled = !this.isRunning;
        this.resetBtn.disabled = !this.isRunning;
    }

    updateDisplay() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        this.timerDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateProgress() {
        const progress = ((this.totalTime - this.remainingTime) / this.totalTime) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    showErrorFeedback() {
        this.minutesInput.classList.add('error');
        setTimeout(() => this.minutesInput.classList.remove('error'), 200);
    }

    timerComplete() {
        this.timeUpSound.play();
        this.resetTimer();
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimerApp();
});