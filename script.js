const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const progressBar = document.getElementById("progress");
const liveScore = document.getElementById("live-score");
const timerDisplay = document.getElementById("timer");
const bgMusic = document.getElementById("bg-music");

let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions = [];
let timer;
let timeLeft = 10;

/* Shuffle array */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/* Questions */
const questions = [
{q:"What planet is known as the Red Planet?",a:[{text:"Earth",c:false},{text:"Mars",c:true},{text:"Jupiter",c:false},{text:"Venus",c:false}]},
{q:"7 x 8 = ?",a:[{text:"54",c:false},{text:"56",c:true},{text:"64",c:false},{text:"49",c:false}]},
{q:"Opposite of Hot?",a:[{text:"Warm",c:false},{text:"Cold",c:true},{text:"Heat",c:false},{text:"Boil",c:false}]},
{q:"Square root of 81?",a:[{text:"9",c:true},{text:"8",c:false},{text:"6",c:false},{text:"7",c:false}]},
{q:"What gas do plants absorb?",a:[{text:"Oxygen",c:false},{text:"Carbon Dioxide",c:true},{text:"Hydrogen",c:false},{text:"Nitrogen",c:false}]},
{q:"15 + 26 = ?",a:[{text:"41",c:true},{text:"36",c:false},{text:"39",c:false},{text:"51",c:false}]},
{q:"Triangle has how many sides?",a:[{text:"3",c:true},{text:"4",c:false},{text:"5",c:false},{text:"6",c:false}]},
{q:"Synonym for Big?",a:[{text:"Large",c:true},{text:"Tiny",c:false},{text:"Small",c:false},{text:"Little",c:false}]},
{q:"100 ÷ 10 = ?",a:[{text:"10",c:true},{text:"5",c:false},{text:"20",c:false},{text:"15",c:false}]},
{q:"Which organ pumps blood?",a:[{text:"Heart",c:true},{text:"Brain",c:false},{text:"Liver",c:false},{text:"Lungs",c:false}]},
{q:"Which punctuation ends a question?",a:[{text:"?",c:true},{text:".",c:false},{text:",",c:false},{text:"!",c:false}]},
{q:"What is H2O?",a:[{text:"Water",c:true},{text:"Salt",c:false},{text:"Oxygen",c:false},{text:"Hydrogen",c:false}]},
{q:"Which word is a noun?",a:[{text:"School",c:true},{text:"Run",c:false},{text:"Quickly",c:false},{text:"Happy",c:false}]},
{q:"How many bones in adult body?",a:[{text:"206",c:true},{text:"201",c:false},{text:"196",c:false},{text:"210",c:false}]},
{q:"Correct sentence?",a:[{text:"She goes to school.",c:true},{text:"She go to school.",c:false},{text:"She going school.",c:false},{text:"She gone school.",c:false}]}
];

startBtn.onclick = () => {
    startScreen.style.display = "none";
    quizScreen.style.display = "flex";
    bgMusic.volume = 0.3;
    bgMusic.play().catch(err => console.log(err));
    startGame();
};

function startGame() {
    score = 0;
    currentQuestionIndex = 0;
    shuffledQuestions = shuffle([...questions]);
    liveScore.innerHTML = "Score: 0";
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    const current = shuffledQuestions[currentQuestionIndex];
    questionElement.innerHTML = current.q;
    progressBar.style.width = ((currentQuestionIndex) / shuffledQuestions.length) * 100 + "%";
    const shuffledAnswers = shuffle([...current.a]);
    shuffledAnswers.forEach(ans => {
        const btn = document.createElement("button");
        btn.innerHTML = ans.text;
        btn.classList.add("btn");
        if (ans.c) btn.dataset.correct = true;
        btn.onclick = selectAnswer;
        answerButtons.appendChild(btn);
    });
    startTimer();
}

function resetState() {
    nextButton.style.display = "none";
    answerButtons.innerHTML = "";
    clearInterval(timer);
    timeLeft = 10;
    timerDisplay.innerHTML = "Time: 10s";
}

function startTimer() {
    timerDisplay.innerHTML = "Time: " + timeLeft + "s";
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerHTML = "Time: " + timeLeft + "s";
        if (timeLeft <= 0) {
            clearInterval(timer);
            autoNext();
        }
    }, 1000);
}

function autoNext() {
    Array.from(answerButtons.children).forEach(btn => {
        if (btn.dataset.correct === "true") btn.classList.add("correct");
        btn.disabled = true;
    });
    nextButton.style.display = "block";
}

function selectAnswer(e) {
    clearInterval(timer);
    const selected = e.target;
    const correct = selected.dataset.correct === "true";
    if (correct) {
        selected.classList.add("correct");
        score++;
        liveScore.innerHTML = "Score: " + score;
    } else {
        selected.classList.add("wrong");
    }
    Array.from(answerButtons.children).forEach(btn => {
        if (btn.dataset.correct === "true") btn.classList.add("correct");
        btn.disabled = true;
    });
    nextButton.style.display = "block";
}

nextButton.onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion();
    } else {
        questionElement.innerHTML = "GAME OVER 🎉<br>Your Final Score: " + score + " / " + shuffledQuestions.length;
        progressBar.style.width = "100%";
        answerButtons.innerHTML = "";
        timerDisplay.innerHTML = "";
        nextButton.innerHTML = "Play Again";
        bgMusic.pause();
        bgMusic.currentTime = 0;
        nextButton.onclick = startGame;
    }
};

/* Ripple effect */
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn")) {
        const button = e.target;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        circle.style.width = circle.style.height = diameter + "px";
        circle.style.left = e.offsetX - radius + "px";
        circle.style.top = e.offsetY - radius + "px";
        circle.classList.add("ripple");
        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) ripple.remove();
        button.appendChild(circle);
    }
});