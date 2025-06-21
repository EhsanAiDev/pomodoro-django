class CookieManager {
    constructor(cookies) {
        this.cookies = cookies;
        this.cookie_name = "pomodoroDone";
        let regex = new RegExp(`${this.cookie_name}=\\d+`, 'i');

        if (regex.test(this.cookies)) {
            let cookies = this.cookies.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let c = cookies[i].trim();
                if (c.startsWith(this.cookie_name + "=")) {
                    c = c.substring(this.cookie_name.length + 1);
                    this.donePomodoros = parseInt(c);
                }
            }
        } else {
            document.cookie = `${this.cookie_name}=0;`;
            this.donePomodoros = 0;
        }
    }

    increaseValue() {
        this.donePomodoros++;
        document.cookie = `${this.cookie_name}=${this.donePomodoros};`;
    }
}

function change_pomodoros() {
    pomodoroTime = document.getElementById("time-pomodoro").value;
    let workMin = pomodoroTime * 25;
    let restMin = pomodoroTime * 5;

    document.getElementById("pomodoro-len-work").textContent = pomodoroTime;
    document.getElementById("work-time").textContent = workMin;

    document.getElementById("pomodoro-len-rest").textContent = pomodoroTime;
    document.getElementById("rest-time").textContent = restMin;
}

function start() {
    pomodoros = [];
    pomodoroTime = document.getElementById("time-pomodoro").value;
    index = 0;
    is_pause = false;


    for (let i = 0; i < pomodoroTime; i++) {
        pomodoros.push("Working");
        pomodoros.push("Resting");
    }
    const textDiv = document.getElementById("text-div");
    const buttonsDiv = document.getElementById("buttons-div");
    const startButton = document.getElementById("start-button");

    textDiv.innerHTML = `
        <span id='status-text'></span><br>
        <span id='timer'></span><br><br>
        <span id='motivate-text'></span>
    `;
    buttonsDiv.removeChild(startButton);


    const skipButton = document.createElement("button");
    skipButton.id = 'skip-button';
    skipButton.textContent = "Skip";
    skipButton.addEventListener('click', skip);

    const pauseButton = document.createElement("button");
    pauseButton.id = 'pause-button';
    pauseButton.textContent = "Pause";
    pauseButton.addEventListener('click', pause);

    buttonsDiv.appendChild(skipButton);
    buttonsDiv.appendChild(pauseButton);


    buttonsDiv.style.display = "grid";
    buttonsDiv.style.gridTemplateColumns = "auto auto"

    pomodorosLeft = pomodoros.length / 2;
    timer(pomodoros, index);
}

function timer(p, index) {
    if (index >= p.length) {
        finishPomodoro();
        return;
    } else {
        let statusImage = document.getElementById("pomodoro-img");
        let timeLeft = p[index] === 'Working' ? 1500 : 300;
        statusImage.src = (p[index] === "Working") ? "/static/pomodoro/images/working.png" : "/static/pomodoro/images/resting.png";

        if (p[index] === "Resting") {
            userCookie.increaseValue();
            pomodorosLeft--;
        }

        let leftPomodoros = document.getElementById("left-pomodoros");
        leftPomodoros.style.display = "inline";
        leftPomodoros.textContent = `Pomodoros Left: ${pomodorosLeft}`;

        function updateTimer() {
            if (is_pause === false){
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                const timeShow = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                document.getElementById("status-text").innerHTML = (p[index] === "Working") ? `Working Time!` : `Resting Time :)`;
                document.getElementById("timer").innerHTML = timeShow;

                if (seconds % 30 === 0) {
                    document.getElementById("motivate-text").innerHTML = randomMotivateText(p[index]);
                }

                timeLeft--;
                if (timeLeft < 0) {
                    skip();
                }
            }
        }

        updateTimer();
        countdown = setInterval(updateTimer, 1000);
    }
}

function randomMotivateText(phase) {
    const workMotivations = [
        "Focus now, your future self will thank you.",
        "Stay in the zone — every second counts!",
        "You’re building something amazing, keep going!",
        "One step closer to your goal — don’t stop now!",
        "Hard work beats talent when talent doesn’t work hard.",
        "Push through! You’re stronger than your distractions.",
        "Let’s go! You’ve got this round.",
        "Deep focus now means deep satisfaction later.",
        "The best investment is in your own effort — give it your all!",
        "You’re not just working, you’re growing."
    ];

    const restMotivations = [
        "Breathe. You’ve earned this break.",
        "Rest is fuel — recharge and come back stronger.",
        "Relax, your next success is loading…",
        "Great job! Let’s give your mind a moment to refresh.",
        "Small breaks lead to big wins — enjoy it!",
        "Step back, stretch, and smile. You’re making progress.",
        "Rest is part of the process — embrace it.",
        "A calm mind is a sharp mind — take this time to reset.",
        "Good work! Get ready to crush the next round.",
        "You worked hard. Now rest smart."
    ];

    const list = phase === "Working" ? workMotivations : restMotivations;
    const text = list[Math.floor(Math.random() * list.length)];
    return text.replaceAll("—", "<br>");
}

function skip() {
    const audio = new Audio("/static/pomodoro/audio/skip-sound-effect.mp3");
    audio.play();

    document.getElementById("done-pomodoros").textContent = `Pomodoro Score: ${userCookie.donePomodoros}`;

    is_pause = false;
    index++;
    clearInterval(countdown);
    timer(pomodoros, index);
    
    const buttonsDiv = document.getElementById("buttons-div");
    const resumeButton = document.getElementById("resume-button");

    const pauseButton = document.createElement("button");
    pauseButton.id = 'pause-button';
    pauseButton.textContent = "Pause";
    pauseButton.addEventListener('click', pause);
    
    buttonsDiv.removeChild(resumeButton);
    buttonsDiv.appendChild(pauseButton); 
}
function resume(){
    const buttonsDiv = document.getElementById("buttons-div");
    const resumeButton = document.getElementById("resume-button");

    const pauseButton = document.createElement("button");
    pauseButton.id = 'pause-button';
    pauseButton.textContent = "Pause";
    pauseButton.addEventListener('click', pause);
    
    buttonsDiv.removeChild(resumeButton);
    buttonsDiv.appendChild(pauseButton); 
    is_pause = false;
}

function pause(){
    const resumeButton = document.createElement("button");
    resumeButton.id = 'resume-button';
    resumeButton.textContent = "Resume";
    resumeButton.addEventListener('click', resume);
    
    
    const buttonsDiv = document.getElementById("buttons-div");
    const pauseButton = document.getElementById("pause-button");
    
    buttonsDiv.removeChild(pauseButton);
    buttonsDiv.appendChild(resumeButton);
    is_pause = true; 


}


function finishPomodoro() {
    const buttonsDiv = document.getElementById("buttons-div");
    const textDiv = document.getElementById("text-div");
    const skipButton = document.getElementById("skip-button");
    const statusImage = document.getElementById("pomodoro-img");

    statusImage.src = "/static/pomodoro/images/studying.png";

    textDiv.innerHTML = `
        <h4 style="margin-top:3px;margin-bottom: 8px;">Good Job!! You finished your pomodoro :)</h4>
        <div id="user-input">
            <input type="number" id="time-pomodoro" inputmode="numeric" value="1" min="1" max="10" step="1" oninput="change_pomodoros()" onkeydown="return false;" required>
            <span> * Pomodoro</span>
        </div>
        <div id="eval-time">
            <div>
                <span id="pomodoro-len-work">1</span><span> * 25 = </span><span id="work-time">25</span><span> min work</span>
            </div>
            <div>
                <span id="pomodoro-len-rest">1</span><span> * 5 = </span><span id="rest-time">5</span><span> min rest</span>
            </div>
        </div>
    `;

    buttonsDiv.innerHTML = ``;
    buttonsDiv.style.gridTemplateColumns = 'auto';
    const startButton = document.createElement("button");
    startButton.id = 'start-button';
    startButton.textContent = "Start";
    startButton.addEventListener('click', start);

    buttonsDiv.appendChild(startButton);

    document.getElementById("left-pomodoros").style.display = "none";

    const audio = new Audio("/static/pomodoro/audio/pomodoro-done-sound-effect.mp3");
    audio.play();
}

// Initialization
userCookie = new CookieManager(document.cookie);
document.getElementById("done-pomodoros").textContent = `Pomodoro Score: ${userCookie.donePomodoros}`;
var is_pause = false;