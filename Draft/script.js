const notes = ["♪", "♫", "♬", "♩"];
const emotions = ["Joy", "Melancholy", "Energy", "Harmony", "Freedom", "Soul", "Passion", "Dream", "Flow"];
const body = document.body;
const backgroundWord = document.getElementById('backgroundWord');

function randomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 60%, 40%)`;
}

function changeBackground() {
  body.style.background = randomColor();
}

function randomNote() {
  return notes[Math.floor(Math.random() * notes.length)];
}

function randomEmotion() {
  return emotions[Math.floor(Math.random() * emotions.length)];
}

document.body.addEventListener('click', (e) => {
  const note = document.createElement('div');
  note.className = 'note';
  note.textContent = randomNote();
  note.style.left = `${e.clientX}px`;
  note.style.top = `${e.clientY}px`;
  note.style.color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`;
  document.body.appendChild(note);

  setTimeout(() => {
    note.remove();
  }, 3000);
});

setInterval(() => {
  changeBackground();
  backgroundWord.textContent = randomEmotion();
}, 4000);
