
class AudioManager {
    constructor() {
        this.enabled = localStorage.getItem('btl_sound_vn') !== 'false';
        this.sounds = {
            hit: new Audio('../assets/hit.mp3'),
            sunk: new Audio('../assets/sunk.mp3'),
            miss: new Audio('../assets/miss.mp3'),
            bgm: new Audio('../assets/bgm.mp3')
        };
        this.sounds.bgm.loop = true;
        this.sounds.bgm.volume = 0.3;
    }

    init() { }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('btl_sound_vn', this.enabled);
        if (this.enabled) {
            this.startBGM();
        } else {
            this.sounds.bgm.pause();
        }
        return this.enabled;
    }

    playHit() {
        if (!this.enabled) return;
        this.sounds.hit.currentTime = 0;
        this.sounds.hit.play().catch(() => { });
    }

    playSunk() {
        if (!this.enabled) return;
        this.sounds.sunk.currentTime = 0;
        this.sounds.sunk.play().catch(() => { });
    }

    playMiss() {
        if (!this.enabled) return;
        this.sounds.miss.currentTime = 0;
        this.sounds.miss.play().catch(() => { });
    }

    startBGM() {
        if (!this.enabled) return;
        this.sounds.bgm.play().catch(() => {
            console.log("Tu dong phat nhac bi chan, doi tuong tac tu nguoi dung.");
        });
    }
}

const AudioSys = new AudioManager();

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('instructions.html') || 
        window.location.pathname.includes('tactical.html')) return;

    let soundBtn = document.getElementById('sound-toggle');

    if (!soundBtn) {
        soundBtn = document.createElement('div');
        soundBtn.id = 'sound-toggle';
        soundBtn.className = 'status-item';
        soundBtn.innerHTML = `
            <span class="icon" id="sound-icon"></span>
            <span class="label" id="sound-label"></span>
        `;

        const backBtn = document.querySelector('.back-btn, .tactical-btn.mini, .tactical-btn.back-btn');
        const header = document.querySelector('.deployment-header, .combat-header, .manual-header, .victory-header');

        if (backBtn && backBtn.parentElement) {
            let actionsWrap = backBtn.parentElement.querySelector('.header-actions-wrapper');
            if (!actionsWrap) {
                actionsWrap = document.createElement('div');
                actionsWrap.className = 'header-actions-wrapper';
                backBtn.parentNode.insertBefore(actionsWrap, backBtn);
                actionsWrap.appendChild(backBtn);
            }
            actionsWrap.prepend(soundBtn);
            soundBtn.classList.add('header-integrated');
        } else if (header) {
            header.appendChild(soundBtn);
            soundBtn.classList.add('header-integrated');
        } else {
            soundBtn.classList.add('global-fixed');
            document.body.appendChild(soundBtn);
        }
    }

    const updateUI = () => {
        const icon = document.getElementById('sound-icon');
        const label = document.getElementById('sound-label');
        if (icon) icon.innerText = AudioSys.enabled ? '🔊' : '🔇';
        if (label) label.innerText = AudioSys.enabled ? 'SOUND ON' : 'SOUND OFF';
    };

    updateUI();

    soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isEnabled = AudioSys.toggle();
        updateUI();
        if (isEnabled && AudioSys.sounds.bgm.paused) {
            AudioSys.startBGM();
        }
    });

    if (AudioSys.enabled) {
        AudioSys.startBGM();
    }
});

const initAudioOnFirstInteraction = () => {
    if (AudioSys.enabled && AudioSys.sounds.bgm.paused) {
        AudioSys.startBGM();
    }
    document.removeEventListener('click', initAudioOnFirstInteraction);
    document.removeEventListener('keydown', initAudioOnFirstInteraction);
};

document.addEventListener('click', initAudioOnFirstInteraction);
document.addEventListener('keydown', initAudioOnFirstInteraction);
