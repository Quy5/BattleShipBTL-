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

function showRankHistory() {
    const modal = document.getElementById('history-modal');
    const list = document.getElementById('history-list');
    modal.style.display = 'flex';
    list.innerHTML = '';

    const history = JSON.parse(localStorage.getItem('btl_match_history_vn')) || [];

    if (history.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: var(--text-muted); margin-top: 20px;">NO CAREER RECORD FOUND.</p>';
        return;
    }

    history.forEach(item => {
        const hItem = document.createElement('div');
        hItem.className = `history-item ${item.win ? 'win' : 'loss'}`;

        const timeStr = formatTime(item.duration);

        hItem.innerHTML = `
            <div class="h-rank">
                <div class="h-icon">${item.rankIcon || '🏅'}</div>
                <div>
                    <div class="h-title">${item.rankName || 'RESERVIST'}</div>
                    <div class="h-date">${item.date || 'Unknown Date'}</div>
                </div>
            </div>
            <div class="h-stats">
                <div class="h-stat-box">
                    <span class="h-stat-label">ACCURACY</span>
                    <span>${item.accuracy}%</span>
                </div>
                <div class="h-stat-box">
                    <span class="h-stat-label">TIME</span>
                    <span>${timeStr}</span>
                </div>
                <div class="h-stat-box" style="color: ${item.win ? 'var(--success-green)' : 'var(--danger-red)'}">
                    <span class="h-stat-label">RESULT</span>
                    <span>${item.win ? 'VICTORY' : 'DEFEAT'}</span>
                </div>
            </div>
        `;
        list.appendChild(hItem);
    });
}

function hideRankHistory() {
    document.getElementById('history-modal').style.display = 'none';
}

function formatTime(seconds) {
    if (!seconds && seconds !== 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
