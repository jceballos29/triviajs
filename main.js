let user = document.getElementById("user");
let coverPage = document.getElementById("cover-page");
let triviaForm = document.getElementById("trivia");
let questionsPage = document.getElementById("containerQuesiton");
let questionsContainer = document.getElementById("questionsContent");
let amount = document.getElementById("amount");
let category = document.getElementById("category");
let difficulty = document.getElementById("difficulty");
let type = document.getElementById("type");
let answers = document.getElementsByClassName("answer");

let userName;
let questions;
let questionIndex = 0;
let correct_index_answer;
let score = 0;

const renderScores = () => {
  let scores = JSON.parse(localStorage.getItem("scores"));
  let score = document.getElementById("scores");

  score.innerHTML = "";

  if (scores !== null) {
    for (let i = 0; i < 10; i++) {
      let { name, points } = scores[i];
      score.innerHTML = `
            <div class="player">
                <i class="fas fa-caret-right"></i>
                <h3>${name}</h3>
                <h3>${points}</h3>
            </div>
            `;
    }
  }
};

const getApiData = async (e) => {
  e.preventDefault();

  let url = `https://opentdb.com/api.php?amount=${amount.value}&category=${category.value}&difficulty=${difficulty.value}&type=${type.value}`;

  response = await fetch(url);
  data = await response.json();
  questions = data.results;
  startGame();
};

const startGame = () => {
    triviaForm.style.display = 'none';
    questionsPage.style.display = 'flex';
    // console.log(category.value);
    // console.log(questions);
    document.getElementById('categoryName').innerText = category.options[document.getElementById('category').selectedIndex].text;
    document.getElementById('userName').innerText = userName;
    document.getElementById('userPoints').innerText = score;
    document.getElementById('num_questions').innerText = amount.value;
    document.getElementById('question_index').innerText = questionIndex + 1;

    
    let currentQuestion = questions[questionIndex];
    document.getElementById("questionName").innerHTML = `<p>${currentQuestion.question}</p>`;

    if (currentQuestion.incorrect_answers.length == 1) {
        document.getElementById("1").innerText = "True";
        document.getElementById("2").innerText = "False";
        document.getElementById("3").style.display = "none";
        document.getElementById("4").style.display = "none";
        if (currentQuestion.correct_answer === "True") correct_index_answer = 1;
        else correct_index_answer = 2;
      } else {
        document.getElementById("1").style.display = "Block";
        document.getElementById("2").style.display = "Block";
        document.getElementById("3").style.display = "Block";
        document.getElementById("4").style.display = "Block";
    
        correct_index_answer = Math.floor(Math.random() * 4) + 1;
        document.getElementById(correct_index_answer).innerText = currentQuestion.correct_answer;
        console.log(correct_index_answer);
        let j = 0;
        for (let i = 1; i <= 4; i++) {
          if (i === correct_index_answer) continue;
          document.getElementById(i).innerText = currentQuestion.incorrect_answers[j];
          j++;
        }
      }
};


const selectAnswer = id => {
    let answerId = id;
    console.log(answerId);
    if (answerId == correct_index_answer) {
      score = score + 1;
      console.log("Respuesta correcta");
    } else {
      console.log("Respuesta incorrecta");
    }
    // console.log(questionIndex == amount.value);
  
    if (questionIndex < amount.value - 1) {
      questionIndex++;
      startGame();
    } else if (questionIndex == amount.value - 1) {
      showResults(score);
    }
  };
  
  const showResults = () => {
    console.log(`Juego terminado`);

  };
  

document.getElementById("welcome").addEventListener("click", () => {
  user.style.display = "flex";
});

document.getElementById("cancel").addEventListener("click", () => {
  user.style.display = "none";
});

document.getElementById("continue").addEventListener("click", () => {
  user.style.display = "none";
  coverPage.style.display = "none";
  userName = document.getElementById("name").value;
  document.getElementById("triviaForm").reset();
  triviaForm.style.display = "flex";
  // console.log(user);
});

  
for (let i = 0; i < answers.length; i++) {
    const element = answers[i];
    element.addEventListener("click", () => selectAnswer(element.id));
  }


document.getElementById("triviaForm").addEventListener("submit", getApiData);

