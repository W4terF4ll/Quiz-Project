var username = "";
var sceneOutput = "";
var answer = "";
var data = "";
var type = "";
var questionNum = 1;
var correct = 0;
var total = 0;
var startTime = 0;

document.addEventListener("DOMContentLoaded", function () {
    sceneOutput = document.getElementById("output");
    loadHome()

    sceneOutput.addEventListener("submit", function(e) {
        e.preventDefault();
        var data = new FormData(e.target);
        username = data.get("name");
        type = data.get("type");
        loadQuiz()
    });
});

function loadHome() {
    var scene1Template = document.getElementById('scene1-template').innerHTML;
    var scene1 = Handlebars.compile(scene1Template);
    var html = scene1({});
    sceneOutput.innerHTML = html;
}

function loadQuiz() {
    questionNum = 1
    correct = 0;
    total = 0;
    startTimer()
    getQuestion(questionNum);
}

async function getQuestion() {
    try {
        console.log(type);
        var res = await fetch(`https://my-json-server.typicode.com/W4terF4ll/db/${type}/${questionNum}`);
        if (!res.ok) {
            loadEnd()
            return;
        }
        data = await res.json();
        answer = data.correct
        loadQuestion()
    } catch (err) {
        console.error("Failed to load:", err);
    }
}

function loadQuestion() {
    var scene2Template = document.getElementById('scene2-template').innerHTML;
    var scene2 = Handlebars.compile(scene2Template);
    var html2 = scene2({qnum: questionNum, qcorrect: correct, qtotal: total, question: data.q, one: data.first, two: data.second, three: data.third, four: data.fourth});
    sceneOutput.innerHTML = html2;
    var now = Date.now();
    var elapsed = Math.floor((now - startTime) / 1000);
    var minutes = Math.floor(elapsed / 60);
    var seconds = elapsed % 60;
    document.getElementById("timer").textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function loadEnd() {
    clearInterval(timer)
    if ((correct / total) >= 0.8) {
        var scene5Template = document.getElementById('scene5-template').innerHTML;
        var scene5 = Handlebars.compile(scene5Template);
        var html5 = scene5({name: username});
        sceneOutput.innerHTML = html5;
    } else {
        var scene6Template = document.getElementById('scene6-template').innerHTML;
        var scene6 = Handlebars.compile(scene6Template);
        var html6 = scene6({name: username});
        sceneOutput.innerHTML = html6;
    }
}

function answered(number) {
    if (number != answer) {
        questionNum += 1;
        total += 1;
        var scene3Template = document.getElementById('scene3-template').innerHTML;
        var scene3 = Handlebars.compile(scene3Template);
        var html3 = scene3({exp: data.explain});
        sceneOutput.innerHTML = html3;
    } else {
        correct += 1;
        var scene4Template = document.getElementById('scene4-template').innerHTML;
        var scene4 = Handlebars.compile(scene4Template);
        var html4 = scene4({});
        sceneOutput.innerHTML = html4;
        setTimeout(() => {
            questionNum += 1;
            total += 1;
            getQuestion()
        }, 1000)
    }
}

function startTimer() {
    startTime = Date.now();
    timer = setInterval(() => {
        var now = Date.now();
        var elapsed = Math.floor((now - startTime) / 1000);
        var minutes = Math.floor(elapsed / 60);
        var seconds = elapsed % 60;
        document.getElementById("timer").textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}