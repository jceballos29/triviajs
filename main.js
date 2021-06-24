let userName;
const form = document.getElementById("trivia");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const difficulty = document.getElementById("difficulty");
const type = document.getElementById("type");
const board = document.getElementById("table-scores");

const blue = "#0984e3";
const violet = "#6c5ce7";
const yellow = "#fdcb6e";
const pink = "#fd79a8";
const green = "#00b894";
const orange = "#e17055";

let questions;
let correct_index_answer;
let indexQuestion;
let score;

async function getApiData(e) {
  e.preventDefault();
  let url = `https://opentdb.com/api.php?amount=${amount.value}&category=${category.value}&difficulty=${difficulty.value}&type=${type.value}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    questions = await data.results;
  } catch (error) {
    console.log("Error", error);
  }

  startGame();
}

function renderScores() {
  let players = JSON.parse(localStorage.getItem("players"));


  board.innerHTML = "";

  if (players !== null) {
    if (players.length > 10) {
      for (let i = 0; i < 10; i++) {
        let {userName,score} = players[i];
        board.innerHTML += `
        <div class="player">
          <i class="fas fa-caret-right"></i>
          <h3>${userName}</h3>
          <p>${score}</p>
        </div>
        `     
      }
    } else {
      for (let i = 0; i < players.length; i++) {
        let {userName,score} = players[i];
        board.innerHTML += `
        <div class="player">
          <i class="fas fa-caret-right"></i>
          <h3>${userName}</h3>
          <p>${score}</p>
        </div>
        `     
      }
    }
  }
};

const selectColor = (value) => {
  let color;
  if (value == 22) {
    color = blue;
  } else if (
    value == 10 ||
    value == 12 ||
    value == 13 ||
    value == 25 ||
    value == 9
  ) {
    color = violet;
  } else if (value == 20 || value == 23 || value == 24) {
    color = yellow;
  } else if (
    value == 11 ||
    value == 14 ||
    value == 26 ||
    value == 28 ||
    value == 29 ||
    value == 31 ||
    value == 32
  ) {
    color = pink;
  } else if (value == 17 || value == 18 || value == 19 || value == 27) {
    color = green;
  } else if (value == 15 || value == 16 || value == 21 || value == 30) {
    color = green;
  } else {
    color = "#8395a7";
  }

  document.body.style.setProperty("--backgroundColor", color);
  document.body.style.setProperty("--option", color);
};

const setScore = () => {
  document.getElementById("score").innerText = score;
};

const setBoard = () => {
  document.getElementById("categoryName").innerHTML =
    category.options[document.getElementById("category").selectedIndex].text;
  document.getElementById("name").innerText = userName;
  setScore();
  document.getElementById("totalQuestions").innerText = amount.value;
  document.getElementById("currentQuestion").innerHTML = indexQuestion + 1;
};

const setQuestionField = () => {
  let currentQuestion = questions[indexQuestion];

  document.getElementById("question").innerHTML = currentQuestion.question;

  if (currentQuestion.incorrect_answers.length == 1) {
    document.getElementById("1").innerText = "True";
    document.getElementById("2").innerText = "False";
    document.getElementById("3").style.display = "none";
    document.getElementById("4").style.display = "none";

    currentQuestion.correct_answer === "True"
      ? (correct_index_answer = 1)
      : (correct_index_answer = 2);
  } else {
    document.getElementById("1").style.display = "Block";
    document.getElementById("2").style.display = "Block";
    document.getElementById("3").style.display = "Block";
    document.getElementById("4").style.display = "Block";

    correct_index_answer = Math.floor(Math.random() * 4) + 1;
    document.getElementById(correct_index_answer).innerHTML =
      currentQuestion.correct_answer;
    let j = 0;
    for (let i = 1; i <= 4; i++) {
      if (i === correct_index_answer) continue;
      document.getElementById(i).innerHTML =
        currentQuestion.incorrect_answers[j];
      j++;
    }
  }
};

const endGame = () => {
  document.getElementById("game").style.display = "none";
  document.getElementById("endGame").style.display = "flex";

  document.getElementById("results").innerHTML = `
  <h3>${userName}</h3>
  <h4><em>Score:</em> ${score}</h4>
  `;

  
  const player = {
    userName,
    score 
  }

  if (localStorage.getItem('players')===null){
    let players = [];
    players.push(player);
    localStorage.setItem('players',JSON.stringify(players));
} else {
    let players = JSON.parse(localStorage.getItem('players'));
    players.push(player)
    localStorage.setItem('players',JSON.stringify(players))
}

  document.getElementById("begin").addEventListener("click", () => {
    trivia();
    document.getElementById("endGame").style.display = "none";
  });
};

const startGame = () => {
  document.getElementById("coverPage").style.display = "none";
  document.getElementById("game").style.display = "grid";

  selectColor(category.value);
  setBoard();
  setQuestionField();

  let buttons = document.getElementById("buttons");
  // let questionNum = questions.length

  buttons.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.id == correct_index_answer) {
        score = score + 1;
        setScore();
      }

      indexQuestion = indexQuestion + 1;
      if (indexQuestion === questions.length) {
        endGame();
      } else {
        setQuestionField();
        document.getElementById("currentQuestion").innerHTML =
          indexQuestion + 1;
      }
    });
  });

  document.getElementById("trivia").reset();
};

const trivia = () => {
  indexQuestion = 0;
  score = 0;
  document.body.style.setProperty("--backgroundColor", "#2f3542");
  renderScores();
  document.getElementById("coverPage").style.display = "grid";
  document.getElementById("first").style.display = "flex";

  document.getElementById("trivia").style.display = "none";
  document.getElementById("user").style.display = "none";

  document.getElementById("ingresar").addEventListener("click", () => {
    document.getElementById("first").style.display = "none";
    document.getElementById("user").style.display = "flex";
  });

  document.getElementById("cancel").addEventListener("click", () => {
    document.getElementById("first").style.display = "flex";
    document.getElementById("user").style.display = "none";
  });

  document.getElementById("continue").addEventListener("click", () => {
    userName = document.getElementById("userName").value;
    document.getElementById("user").style.display = "none";
    document.getElementById("trivia").style.display = "flex";
  });

  document.getElementById("start").addEventListener("click", getApiData);
};

trivia();
