const username= document.getElementById('username');
const saveScoreBtn=document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore= localStorage.getItem('mostRecentScore');
const highScore = JSON.parse(localStorage.getItem("highScores")) || [];

finalScore.innerText= mostRecentScore;
username.addEventListener('keyup', ()=>{
    saveScoreBtn.disabled=!username.value;
});

saveHighScore = (e)=>{
    e.preventDefault();
    const score= {
        score:Math.floor(Math.random()*100),
        name:username.value
    };
    highScore.push(score);
    highScore.sort ((a,b) => b.score - a.score);
    highScore.splice(5);
    localStorage.setItem('highScores', JSON.stringify(highScore));
    window.location.assign("./")
    console.log(highScore);
};
localStorage.removeItem('quizState');
