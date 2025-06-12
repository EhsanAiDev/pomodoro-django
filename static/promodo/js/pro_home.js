class CookieManager{
    constructor(cookies){
        this.cookies = cookies;
        this.cookie_name = "promodoDone";
        let regex = new RegExp(`${this.cookie_name}=\\d+`, 'i');

        if (regex.test(this.cookies)){
            let cookies = this.cookies.split(';');
            
            for (let i = 0; i < cookies.length; i++) {
                let c = cookies[i].trim();
                if (c.startsWith(this.cookie_name + "=")) {
                    c = c.substring(this.cookie_name.length + 1);
                    this.donePromodos = parseInt(c);
                }
            }
        }else{
            document.cookie = `${this.cookie_name}=0;`;
            this.donePromodos = 0;
        }
    }

    increaseValue(value){
        this.donePromodos++ ;
        document.cookie=`${this.cookie_name}=${this.donePromodos};` ;
    }
}


function change_promodos() {
    promodoTime = document.getElementById("time-promodo").value;
    workMin = promodoTime * 25;
    restMin = promodoTime * 5;

    document.getElementById("promodo-len-work").textContent = promodoTime;
    document.getElementById("work-time").textContent = workMin;

    document.getElementById("promodo-len-rest").textContent = promodoTime;
    document.getElementById("rest-time").textContent = restMin;
}

function start() {
    promodos = [];
    index = 0;
    
    for (i = 0; i < promodoTime; i++) {
        promodos.push("Working");
        promodos.push("Resting");
    }
    
    const mainDiv = document.getElementById("main-div");
    const textDiv = document.getElementById("text-div");
    const startButton = document.getElementById("start-button");
    
    textDiv.innerHTML = '';
    textDiv.innerHTML = `
    <span id='status-text'></span><br>
    <span id='timer'></span><br><br>
    
    <span id='motivate-text'></span>
    `
    const skipButton = document.createElement("button");
    skipButton.id = 'skip-button'
    skipButton.textContent = "Skip";
    skipButton.addEventListener('click', function() {
        skip();
    });
    
    
    mainDiv.removeChild(startButton);
    mainDiv.appendChild(skipButton);
    
    promodosLeft = promodos.length / 2 ;
    timer(promodos,index);
}


function timer(p , index) {

    if (index >= p.length) {
        const mainDiv = document.getElementById("main-div");
        const textDiv = document.getElementById("text-div");
        const skipButton = document.getElementById("skip-button");
        const status_image = document.getElementById("promodo-img");
        status_image.src = "/static/promodo/images/studying.png" ;


        textDiv.innerHTML = '';
        textDiv.innerHTML = `
            <h4 style="margin-top:3px;margin-bottom: 8px;" c>Good Job!! You did you promodo :)</h4>
            <div id="user-input">
              <input type="number" id="time-promodo" inputmode="numeric" value="1" min="1"  max="10" step="1" oninput="change_promodos()" onkeydown="return false;" required>                  
              <span> * Promodo</span>
            </div>
            <div id="eval-time">
                <div>
                    <span id="promodo-len-work">1</span><span> * 25 = </span><span id="work-time">25</span><span> min work</span>
                </div>
                <div>
                    <span id="promodo-len-rest">1</span><span> * 5 = </span><span id="rest-time">5</span><span> min rest</span>
                </div>
            </div>
        `

        const startButton = document.createElement("button");
        startButton.id = 'start-button'
        startButton.textContent = "Start";
        startButton.addEventListener('click', function() {
            start();
        });

        
        mainDiv.removeChild(skipButton);
        mainDiv.appendChild(startButton)
        

        leftPromods = document.getElementById("left-promodos") 
        leftPromods.style.display = "none"

        audio = new Audio("/static/promodo/audio/promodo-done-sound-effect.mp3");
        audio.play();

                
        return;
    } else {
        let status_image = document.getElementById("promodo-img")
        let timeLeft = p[index] === 'Working' ? 1500 : 300;
        status_image.src = (p[index] === "Working") ? "/static/promodo/images/working.png" : "/static/promodo/images/resting.png"
        if(p[index] === "Resting" ) userCookie.increaseValue(); 
        if(p[index] === "Resting" ) promodosLeft--; 

        leftPromods = document.getElementById("left-promodos") 
        leftPromods.style.display = "inline"
        leftPromods.textContent = `Promodos Left: ${promodosLeft}`



        function updateTimer() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            const timeShow = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            
            document.getElementById("status-text").innerHTML = (p[index] === "Working") ? `${p[index]} Time !` : `${p[index]} Time :)`
            document.getElementById("timer").innerHTML = timeShow;

            if (seconds % 30 === 0) {
                document.getElementById("motivate-text").innerHTML = randomMotivateText(p[index],status_image);
            }

            timeLeft--;
            if (timeLeft < 0) {
                skip();
            }
        }

        updateTimer();
        countdown = setInterval(updateTimer, 1000);

    }
}

function randomMotivateText(phase, status_image){
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
    if (phase === "Working"){
        const text = workMotivations[Math.floor( Math.random() * workMotivations.length)]
        return text.replaceAll("—" , "<br>");
    }else{
        const text = restMotivations[Math.floor( Math.random() * restMotivations.length)]
        return text.replaceAll("—" , "<br>");
    }

}

function skip() {
    audio = new Audio("/static/promodo/audio/skip-sound-effect.mp3");
    audio.play();
    document.getElementById("done-promodos").textContent = `Pomodoro Score: ${userCookie.donePromodos}`;

    
    index++ ; 
    clearInterval(countdown);
    timer(promodos , index)
}


document.getElementById("time-promodo").value = 1;
promodoTime = document.getElementById("time-promodo").value; // defualt value if the eval_promodo is not called by user
userCookie = new CookieManager(document.cookie);
document.getElementById("done-promodos").textContent = `Pomodoro Score: ${userCookie.donePromodos}`;



