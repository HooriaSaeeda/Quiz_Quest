// const question = document.getElementById("question"); 
// const choices =Array.from(document.getElementsByClassName("choice-text")) ;
// const progressText = document.getElementById('progressText'); 
// const scoreText = document.getElementById('score'); 
// const progressBarFull = document.getElementById('progressBarFull');
// const loader = document.getElementById('loader');
// const game = document.getElementById('game');
// let currentQuestion= {};
// let acceptingAnswers= false;
// let score= 0;
// let questionCounter=0;
// let availableQuestions= [];

// let questions = [];
// // questions from question.json file
// // fetch('questions.json').then(res=>{
// //     console.log(res);
// //     return res.json();
// // }).then(loadedQuestions =>{
// //     console.log(loadedQuestions);
// //     questions=loadedQuestions;
// //     startGame();

// // })
// // .catch( err =>{
// //     console.log("Can not load questions");
// // }
   
// // );

// // fetching questions from open triva DB

// fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple')
// .then(res=>{
//         console.log(res);
//         return res.json();
//     })
//     .then((loadedQuestions) => {
//         console.log(loadedQuestions.results);
//         questions = loadedQuestions.results.map((loadedQuestion) => {
//             const formattedQuestion = {
//                 question: loadedQuestion.question,
//             };

//             const answerChoices = [...loadedQuestion.incorrect_answers];
//             formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
//             answerChoices.splice(
//                 formattedQuestion.answer - 1,
//                 0,
//                 loadedQuestion.correct_answer
//             );

//             answerChoices.forEach((choice, index) => {
//                 formattedQuestion['choice' + (index + 1)] = choice;
//             });

//             return formattedQuestion;
//         });
       
//         startGame();
//     })
//     .catch((err) => {
//         console.error(err);
//     });
// // CONSTANTS
// const CORRECT_BOUNS=10;
// const MAX_QUESTIONS= 3;

// startGame= ()=>{
// questionCounter=0;
// score=0;
// availableQuestions=[...questions];
// getNewQuestion();
// game.classList.remove("hidden");
// loader.classList.add("hidden");
// };


// getNewQuestion= ()=>{
//     if(availableQuestions.length ===0 || questionCounter>=MAX_QUESTIONS)
//     { 
//         localStorage.setItem('mostRecentScore', score);
//         return window.location.assign("/end.html");
//     }
//     questionCounter++;
//     // questionCounterText.innerText=questionCounter + "/" + MAX_QUESTIONS;
//     progressText.innerText= `Question ${questionCounter}/${MAX_QUESTIONS}` ;
// // update progressBar
// progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
// console.log(progressBarFull.style.width);
//     const questionIndex = Math.floor(Math.random() * availableQuestions.length);
//     currentQuestion = availableQuestions[questionIndex];
//     question.innerText = currentQuestion.question;

//     choices.forEach(choice => {
//         const number = choice.dataset['number'];
//         choice.innerText= currentQuestion["choice" + number];
//     });
//     availableQuestions.splice(questionIndex,1);
//     acceptingAnswers=true;
// };
// choices.forEach(choice =>{
//     choice.addEventListener('click', e=>{
//         if(acceptingAnswers)
//         {
//             acceptingAnswers=false;
//             const selectedChoice=e.target;
//             const selectedAnswer= selectedChoice.dataset["number"];
//             const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' :'incorrect';
//             if(classToApply==='correct')
//             {
//              incrementScore(CORRECT_BOUNS);
//             }
//             saveState();
//         selectedChoice.parentElement.classList.add(classToApply);
    
//         setTimeout(()=>{
//             selectedChoice.parentElement.classList.remove(classToApply);
//             getNewQuestion();
//           },1000);
         

//         }
//     });
// });
// incrementScore= num=>{
//     score+=num;
//     scoreText.innerText= score;

// };
// // startGame();
// // pause menu
// const pauseMenu= document.getElementById("pause-menu");
// const menuIcon= document.querySelector('.menu-icon');
// const resumeBtn= document.getElementById("resume");
// menuIcon.addEventListener('click',()=> pauseMenu.style.display="flex");
// resumeBtn.addEventListener('click', ()=>pauseMenu.style.display="none");

// -------------------------------------------------------------
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

// fetching questions from open trivia DB
fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple')
.then(res => {
    return res.json();
})
.then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
        const formattedQuestion = {
            question: loadedQuestion.question,
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
        answerChoices.splice(
            formattedQuestion.answer - 1,
            0,
            loadedQuestion.correct_answer
        );

        answerChoices.forEach((choice, index) => {
            formattedQuestion['choice' + (index + 1)] = choice;
        });

        return formattedQuestion;
    });

    startGame();
})
.catch((err) => {
    console.error(err);
});

// CONSTANTS
const CORRECT_BOUNS = 10;
const MAX_QUESTIONS = 3;
const MAX_RETRIES = 5;


const fetchQuestions = async (retryCount = 0) => {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple');
        if (!response.ok) {
            if (response.status === 429 && retryCount < MAX_RETRIES) {
                // Wait and retry
                const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
                console.log(`Rate limit exceeded. Retrying in ${waitTime / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return fetchQuestions(retryCount + 1);
            } else {
                throw new Error(`Error fetching questions: ${response.status}`);
            }
        }
        const loadedQuestions = await response.json();
        if (!loadedQuestions.results) {
            throw new Error('Invalid API response');
        }
        return loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
    } catch (error) {
        console.error(error);
        alert('Failed to load questions. Please try again later.');
    }
};


startGame = async (loadSavedState = true) => {
    if (loadSavedState) {
        const savedState = localStorage.getItem('quizState');
        if (savedState) {
            loadState();
            game.classList.remove("hidden");
            loader.classList.add("hidden");
            return;
        }
    }
    
    // Clear state and initialize variables
    clearState();
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign("./end.html");
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion["choice" + number];
    });
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
    saveState(); // Save state after getting a new question
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (acceptingAnswers) {
            acceptingAnswers = false;
            const selectedChoice = e.target;
            const selectedAnswer = selectedChoice.dataset["number"];
            const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
            if (classToApply === 'correct') {
                incrementScore(CORRECT_BOUNS);
            }
            saveState();
            selectedChoice.parentElement.classList.add(classToApply);

            setTimeout(() => {
                selectedChoice.parentElement.classList.remove(classToApply);
                getNewQuestion();
            }, 1000);
        }
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};

const saveState = () => {
    const state = {
        currentQuestion,
        score,
        questionCounter,
        availableQuestions
    };
    localStorage.setItem('quizState', JSON.stringify(state));
};

const loadState = () => {
    const savedState = localStorage.getItem('quizState');
    if (savedState) {
        const { currentQuestion: savedCurrentQuestion, score: savedScore, questionCounter: savedQuestionCounter, availableQuestions: savedAvailableQuestions } = JSON.parse(savedState);
        currentQuestion = savedCurrentQuestion;
        score = savedScore;
        questionCounter = savedQuestionCounter;
        availableQuestions = savedAvailableQuestions;
        renderQuestion();
    }
};

const clearState = () => {
    localStorage.removeItem('quizState');
    console.log("State cleared");
};
function decodeHtml() {
    var txt = document.createElement("textarea");
    txt.innerHTML = currentQuestion.question;
    return txt.value;
}
function decodeChoice(choice){
    var txt = document.createElement("textarea");
    txt.innerHTML = choice ;
    return txt.value;
}
const renderQuestion = () => {
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    question.innerText =decodeHtml() ;
    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText =decodeChoice(currentQuestion["choice" + number]);
    });
    acceptingAnswers = true;
};

// Pause and resume functionality
const pauseMenu = document.getElementById("pause-menu");
const menuIcon = document.querySelector('.menu-icon');
const resumeBtn = document.getElementById("resume");
const background_overlay=document.querySelector('.background-overlay');

menuIcon.addEventListener('click', () => {
    pauseMenu.style.display = "flex";
    background_overlay.style.display="flex";
});
resumeBtn.addEventListener('click', () => {
    pauseMenu.style.display = "none";
    background_overlay.style.display="none";
    loadState(); // Load the state when resuming
});


