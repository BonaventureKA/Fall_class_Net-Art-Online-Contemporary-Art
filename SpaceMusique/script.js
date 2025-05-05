// Get elements and set up full-page container
const container = document.getElementById('container');
const poemElement = document.getElementById('poem');

// Make container cover entire viewport
container.style.position = 'fixed';
container.style.top = '0';
container.style.left = '0';
container.style.width = '100vw';
container.style.height = '100vh';
container.style.overflow = 'hidden';

// Visual elements
const notes = ['♪', '♫', '♩', '♬', '♭', '♮', '♯'];
const colors = ['#0f0', '#0ff', '#f0f', '#ff0'];

// Enhanced word bank with nature/tech fusion
const wordBank = {
    1: ["data", "root", "glitch", "leaf", "net", "web", "dew"],
    2: ["error", "petals", "signal", "pixel", "static", "sap"],
    3: ["digital", "mycelium", "network", "hacker", "chlorophyll"],
    5: ["cyberspace", "photosynthesis", "hypertext", "ecosystem", "404_error"]
};

// Haiku templates
const templates = [
    "{1}\n{1}\n{2}\n{3}\n{5}",
    "{1} {1}\n{2} {3}\n{5}",
    "> {1}\n> {1} {2}\n> {3} {5}"
];

// Adaptive sound generators
const soundGenerators = {
    chiptune: (ctx, freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = freq;
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    },
    ambient: (ctx, freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq * 0.5;
        const gain = ctx.createGain();
        gain.gain.value = 0.3;
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        osc.stop(ctx.currentTime + 1.5);
    }
};

let lastMouseTime = 0;
let currentSoundMode = 'chiptune';

// Mouse speed detection for adaptive audio
document.addEventListener('mousemove', () => {
    const now = Date.now();
    const speed = now - lastMouseTime;
    lastMouseTime = now;
    currentSoundMode = speed < 100 ? 'ambient' : 'chiptune';
});

// Full-page click handler
document.addEventListener('click', async (e) => {
    // Don't trigger when clicking on poem text
    if (e.target === poemElement) return;
    
    const x = e.clientX;
    const y = e.clientY;
    const context = new (window.AudioContext || window.webkitAudioContext)();
    
    // Clear previous notes with fade-out
    document.querySelectorAll('.note, .neural-connection').forEach(el => {
        el.style.transition = 'all 0.5s';
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 500);
    });
    
    // Generate extended Fibonacci sequence
    let fib = [1, 1, 2, 3, 5, 8, 13];
    const fibWords = [];
    
    // Create notes with dynamic parameters
    let angle = 0;
    let baseRadius = Math.min(window.innerWidth, window.innerHeight) * 0.2;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    fib.forEach((num, index) => {
        const layerRadius = baseRadius * (1 + index * 0.3);
        const noteSize = 8 + num * 3;
        
        for (let i = 0; i < num; i++) {
            // Calculate position with spiral pattern
            const noteX = x + Math.cos(angle) * layerRadius;
            const noteY = y + Math.sin(angle) * layerRadius;
            
            // Create note element
            const note = document.createElement('div');
            note.className = 'note neural';
            note.style.setProperty('--pulse-color', colors[Math.floor(Math.random() * colors.length)]);
            note.style.left = `${noteX}px`;
            note.style.top = `${noteY}px`;
            note.style.width = `${noteSize}px`;
            note.style.height = `${noteSize}px`;
            container.appendChild(note);
            
            // Create connections (every 2nd note for performance)
            if (i % 2 === 0) {
                // Connect to center
                drawConnection(
                    x, y,
                    noteX, noteY,
                    colors[index % colors.length],
                    0.4
                );
                
                // Connect to previous note
                if (i > 0) {
                    const prevAngle = angle - (Math.PI * 2 / num) * 2;
                    const prevX = x + Math.cos(prevAngle) * layerRadius;
                    const prevY = y + Math.sin(prevAngle) * layerRadius;
                    drawConnection(
                        prevX, prevY,
                        noteX, noteY,
                        colors[(index + 1) % colors.length],
                        0.6
                    );
                }
            }
            
            // Play spatial sound
            const pan = (noteX - centerX) / centerX;
            playSpatialSound(context, 110 + (num * 15) + (i * 3), pan);
            
            angle += (Math.PI * 2) / num;
        }
        
        // Collect words for haiku
        const words = wordBank[num] || ["~"];
        fibWords.push(words[Math.floor(Math.random() * words.length)]);
    });
    
    // Generate and display haiku
    const haiku = await generateHaiku(fibWords);
    poemElement.innerHTML = haiku.replace(/\n/g, '<br>');
    poemElement.style.fontSize = `${Math.min(window.innerWidth * 0.03, 20)}px`;
});

// Enhanced connection drawing
function drawConnection(x1, y1, x2, y2, color, opacity = 0.7) {
    const line = document.createElement('div');
    line.className = 'neural-connection';
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    line.style.width = `${length}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.background = `linear-gradient(90deg, transparent, ${color}, transparent)`;
    line.style.opacity = opacity;
    line.style.height = `${1 + Math.random() * 2}px`;
    
    container.appendChild(line);
    setTimeout(() => {
        line.style.transition = 'opacity 1s';
        line.style.opacity = '0';
        setTimeout(() => line.remove(), 1000);
    }, 2000);
}

// Spatial audio with stereo panning
function playSpatialSound(ctx, freq, pan = 0) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();
    
    osc.type = currentSoundMode === 'chiptune' ? 'square' : 'sine';
    osc.frequency.value = freq;
    panner.pan.value = pan;
    gain.gain.value = currentSoundMode === 'chiptune' ? 0.1 : 0.05;
    
    osc.connect(gain).connect(panner).connect(ctx.destination);
    osc.start();
    
    const duration = currentSoundMode === 'chiptune' ? 0.2 : 1.5;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
}

// Haiku generator
async function generateHaiku(words) {
    const haikus = [
        `${words[0]} ${words[1]}\n${words[2]} in the machine\n${words[3]} ${words[4]}`,
        `Error ${words[0]}\n${words[1]} roots find sunlight\n${words[4]} reboots`,
        `${words[0]} ${words[0]}\n${words[2]} ${words[3]}\n${words[4]} blossoms`
    ];
    return new Promise(resolve => {
        setTimeout(() => resolve(haikus[Math.floor(Math.random() * haikus.length)]), 300);
    });
}
