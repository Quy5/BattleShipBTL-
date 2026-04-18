
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
        document.getElementById('rank-name').innerText = stats.win ? 'FLEET ADMIRAL' : 'RESERVIST';
        if (!stats.win) document.querySelector('.rank-badge').classList.add('defeat');
    }
};

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
