window.onload = () => {

};

function showDifficultySelect() {
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('difficulty-nav').style.display = 'flex';
}

function hideDifficultySelect() {
    document.getElementById('difficulty-nav').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
}

function startGame(difficulty) {
    LuuTru.luuDoKho(difficulty);
    location.href = 'deployment.html';
}
