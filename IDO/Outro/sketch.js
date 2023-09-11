// See the 'assets' folder for our MP3 file URL
const MP3 = "../IDO.wav";

// Master volume in decibels
const volume = 0;

let player, loaded, analyser;

let playing = false;

// Store the amplitudes so we can smoothly interpolate them
let amplitudes;

// Create a new canvas to the browser size
async function setup () {
  createCanvas(windowWidth, windowHeight);
  
  // Clear with black on setup
  background(0);

  // Make the volume quieter
  Tone.Master.volume.value = volume;

  // We can use 'player' to play MP3 files
  player = new Tone.Player();
  player.loop = true;
  player.autostart = false;
  player.connect(Tone.Master);
  
  // Load and "await" the MP3 file
  await player.load(MP3);
  
  // Create an analyser node that makes a waveform
  analyser = new Tone.Analyser('fft', 1024);
  
  
  // Create a new list of amplitudes filled with 0s
  amplitudes = new Array(analyser.size).fill(0);
  
  // Connect with analyser as well so we can detect waveform
  player.connect(analyser);
}

// On window resize, update the canvas size
function windowResized () {
  resizeCanvas(windowWidth, windowHeight);
}

// Render loop that draws shapes with p5
function draw() {
  // Ensure everything is loaded first
  if (!player || !analyser) return;
  
  const dim = Math.min(width, height);

  // Black background
  background(0);
  
  strokeWeight(dim * 0.0175);
  stroke(255);
  noFill();
  
  
  const values = analyser.getValue();
  const dt = deltaTime / 1000;
  const power = 250;
  for (let i = 0; i < amplitudes.length; i++) {
    // Previous value
    const a = amplitudes[i];
    
    // Here we take the decibels and map it to some 0..1 value
    const minDb = -100;
    const maxDb = -50;
    const db = max(minDb, min(maxDb, values[i]));
    
    // New target (i.e. from audio)
    const b = inverseLerp(minDb, maxDb, db);
    
    // Spring toward
    amplitudes[i] = spring(a, b, power, dt);
  }

  // Draw FFT values
  stroke(255);
  strokeWeight(dim * 0.0175);
  noFill();    
  const maxRadius = dim * 0.3;
  const minRadius = dim * 0.175;
  const bands = 10;
  const L = amplitudes.length;
  for (let i = 0; i < bands; i++) {
    const tStart = i / bands;
    const tEnd = tStart + (1 / bands);
    const bandStart = min(L, floor(tStart * L));
    const bandEnd = min(L, floor(tEnd * L));
    const avg = average(amplitudes, bandStart, bandEnd);

    const r = minRadius + maxRadius * tStart;

    // Min and max line thickness
    const maxThickness = maxRadius / bands * 1;
    const minThickness = maxRadius / bands * 0.1;
    const signal = max(0, min(1, avg));
    const thickness = lerp(minThickness, maxThickness, signal);

    strokeWeight(thickness);
    stroke(255);
    // draw an arc
    const d = r * 2; // diameter
    arc(width / 2, height / 2, d, d, 0, PI * 2);
  }
  
  // Draw a 'play' or 'stop' button
  noStroke();
  fill(255);
  polygon(width / 2, height / 2, dim * 0.1, playing ? 4 : 3, playing ? PI / 4 : 0);
}

function average (list, startIndex, endIndex) {
  let sum = 0;
  const count = endIndex - startIndex;
  if (count <= 0) return 0;
  for (let i = startIndex; i < endIndex; i++) {
    sum += list[i];
  }
  return sum / count;
}

function mousePressed () {
  if (player && player.loaded) {
    if (playing) {
      playing = false;
      player.stop();
    } else {
      playing = true;
      player.restart();
    }
  }
}

// Inverse of lerp()
// t = inverseLerp(min, max, current)
function inverseLerp (min, max, current) {
  if (Math.abs(min - max) < 1e-10) return 0;
  else return (current - min) / (max - min);
}

// Draw a basic polygon, handles triangles, squares, pentagons, etc
function polygon(x, y, radius, sides = 3, angle = 0) {
  beginShape();
  for (let i = 0; i < sides; i++) {
    const a = angle + TWO_PI * (i / sides);
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// Springs A toward B with a power, accepting deltaTime
function spring (a, b, power, dt) {
  return lerp(a, b, 1 - Math.exp(-power * dt));
}