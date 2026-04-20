
window.onload = () => {
    const stats = JSON.parse(localStorage.getItem('btl_final_stats_vn'));
    if (stats) {
        const title = document.getElementById('victory-title');
        const subtitle = document.querySelector('.status-subtitle');
        title.innerText = stats.win ? 'VICTORY' : 'DEFEAT';
        subtitle.innerText = stats.win ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED';
        title.style.color = stats.win ? 'var(--success-green)' : 'var(--danger-red)';
        document.getElementById('stat-shots').innerText = stats.shots;
        document.getElementById('stat-accuracy').innerText = stats.accuracy + '%';
        document.getElementById('stat-duration').innerText = formatTime(stats.duration);
        document.getElementById('stat-sunk').innerText = (stats.sunk !== undefined ? stats.sunk : (stats.win ? 5 : 0)) + '/5';
        let rankName = 'RESERVIST';
        let rankIcon = '🏅';
        if (stats.win) {
            const acc = parseFloat(stats.accuracy);
            if (acc >= 70) {
                rankName = 'FLEET ADMIRAL';
                rankIcon = '🌟';
            } else if (acc >= 50) {
                rankName = 'COMMANDER';
                rankIcon = '🎖️';
            } else if (acc >= 30) {
                rankName = 'CAPTAIN';
                rankIcon = '⭐';
            } else {
                rankName = 'LIEUTENANT';
                rankIcon = '🛡️';
            }
        }

        document.getElementById('rank-name').innerText = rankName;
        const iconElement = document.getElementById('rank-icon');
        if (iconElement) iconElement.innerText = rankIcon;

        const timeInfoElement = document.getElementById('rank-time');
        if (timeInfoElement) timeInfoElement.innerText = formatTime(stats.duration);

        if (!stats.win) {
            document.querySelector('.rank-badge').classList.add('defeat');
            const rankLabel = document.getElementById('rank-label');
            if (rankLabel) rankLabel.innerText = 'RANK MAINTAINED';
        }
        let history = JSON.parse(localStorage.getItem('btl_match_history_vn')) || [];
        const exists = history.find(item => item.id === stats.id);
        if (!exists) {
            const historyItem = {
                id: stats.id || Date.now(),
                date: stats.date || new Date().toLocaleString('en-GB'),
                win: stats.win,
                accuracy: stats.accuracy,
                duration: stats.duration,
                rankName: rankName,
                rankIcon: rankIcon
            };
            history.unshift(historyItem);
            if (history.length > 50) history.pop();
            localStorage.setItem('btl_match_history_vn', JSON.stringify(history));
        }
    }
};

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
