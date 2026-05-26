import './styles.css'; // Vite allows you to import CSS directly into JS!

const flowers = ['🌻', '🌸', '🌹', '🌷', '🌼', '💮', '🌱'];
let audioCtx = null;

document.addEventListener('click', (e) => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    spawnFlower(e.clientX, e.clientY);
    playSound(e.clientX, e.clientY);
});

function spawnFlower(x, y) {
    const flower = document.createElement('div');
    flower.classList.add('flower');
    flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];
    flower.style.left = `${x}px`;
    flower.style.top = `${y}px`;
    
    document.body.appendChild(flower);

    setTimeout(() => flower.remove(), 2000); 
}

function playSound(x, y) {
    if (!audioCtx) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const xPercentage = x / window.innerWidth;
    const minFreq = 150;
    const maxFreq = 1200;
    const frequency = minFreq + (xPercentage * (maxFreq - minFreq));
    
    oscillator.type = 'sine'; 
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    const yPercentage = y / window.innerHeight;
    const maxVolume = Math.max(0.01, 1 - yPercentage); 

    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(maxVolume, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    oscillator.start(now);
    oscillator.stop(now + 0.6);
}