const container = document.getElementById('container');
const poemElement = document.getElementById('poem');
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
container.addEventListener('mousemove', () => {
    const now = Date.now();
    const speed = now - lastMouseTime;
    lastMouseTime = now;
    currentSoundMode = speed < 100 ? 'ambient' : 'chiptune';
});

container.addEventListener('click', async (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const context = new (window.AudioContext || window.webkitAudioContext)();
    
    // Clear previous notes but keep connections for 1sec
    document.querySelectorAll('.note').forEach(note => {
        note.style.transition = 'all 1s';
        note.style.opacity = '0';
        setTimeout(() => note.remove(), 1000);
    });
    
    // Generate Fibonacci sequence
    let fib = [1, 1];
    for (let i = 2; i < 6; i++) fib[i] = fib[i-1] + fib[i-2];
    
    // Create neural notes
    let angle = 0;
    let radius = 10;
    const fibWords = [];
    
    fib.forEach((num, index) => {
        for (let i = 0; i < num; i++) {
            const note = document.createElement('div');
            note.className = 'note neural';
            note.style.setProperty('--pulse-color', colors[Math.floor(Math.random() * colors.length)]);
            note.style.left = `${x + Math.cos(angle) * radius}px`;
            note.style.top = `${y + Math.sin(angle) * radius}px`;
            note.style.width = `${5 + num}px`;
            note.style.height = `${5 + num}px`;
            container.appendChild(note);
            
            // Connect notes visually
            if (i > 0) {
                drawConnection(
                    x + Math.cos(angle - (Math.PI * 2 / num)) * (radius - 15),
                    y + Math.sin(angle - (Math.PI * 2 / num)) * (radius - 15),
                    x + Math.cos(angle) * radius,
                    y + Math.sin(angle) * radius,
                    colors[index % colors.length]
                );
            }
            
            // Play adaptive sound
            soundGenerators[currentSoundMode](
                context, 
                110 + (num * 20) + (i * 5), 
                0.1 + (num * 0.02)
            );
            
            angle += (Math.PI * 2) / num;
            radius += 20;
        }
        
        // Collect words for haiku
        const words = wordBank[num] || ["~"];
        fibWords.push(words[Math.floor(Math.random() * words.length)]);
    });
    
    // Generate AI-assisted haiku
    const haiku = await generateHaiku(fibWords);
    poemElement.innerHTML = haiku.replace(/\n/g, '<br>');
});

function drawConnection(x1, y1, x2, y2, color) {
    const line = document.createElement('div');
    line.className = 'neural-connection';
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    line.style.width = `${length}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.backgroundColor = color;
    line.style.opacity = '0.7';
    
    container.appendChild(line);
    setTimeout(() => line.remove(), 1000);
}

// Mock AI haiku generator (in real implementation, use an API)
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