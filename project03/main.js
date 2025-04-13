var username = ""
var sceneOutput = ""
var answer = ""

document.addEventListener("DOMContentLoaded", function () {
    sceneOutput = document.getElementById("output");
    var scene1Template = document.getElementById('scene1-template').innerHTML;
    var scene1 = Handlebars.compile(scene1Template);
    var html = scene1({});
    sceneOutput.innerHTML = html;

    var form = document.getElementById("quiz-form");
    sceneOutput.addEventListener("submit", function(e) {
        e.preventDefault();
        var data = new FormData(e.target);
        username = data.get("name");
        getQuestion(1);
    });
});

async function getQuestion(number) {
    try {
        var res = await fetch(`https://my-json-server.typicode.com/W4terF4ll/db/questions/${number}`);
        var data = await res.json();
        answer = data.correct
        loadQuestion(data)
    } catch (err) {
        console.error("Failed to load:", err);
    }
}

//for name: name: username

function loadQuestion(data) {
    var scene2Template = document.getElementById('scene2-template').innerHTML;
    var scene2 = Handlebars.compile(scene2Template);
    var html2 = scene2({question: data.q, one: data.first, two: data.second, three: data.third, four: data.fourth});
    sceneOutput.innerHTML = html2;
}

function answered(number) {
    if (number != answer) {
        console.log("wrong")
    } else {
        console.log("correct")
    }
}