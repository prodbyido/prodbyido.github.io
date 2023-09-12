// See the 'assets' folder for our MP3 file URL
const MP3 = "../IDO.wav";

// Master volume in decibels
const volume = 0;

let player, loaded, analyser;

let playing = false;

// Create a new canvas to the browser size
async function setup () {
  createCanvas(windowWidth, windowHeight);
  
  // Clear with black on setup
background('rgba(70,109,114, 0.3)');

  // Make the volume quieter
  Tone.Master.volume.value = volume;

  // We can use 'player' to 
  player = new Tone.Player();
  player.loop = true;
  player.autostart = false;
  player.loopStart = 0;
  player.connect(Tone.Master);
  
  // Load and "await" the MP3 file
  await player.load(MP3);
  
  // Create an analyser node that makes a waveform
  analyser = new Tone.Analyser('waveform', 128);
  
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
background('rgba(70,109,114, 0.3)');
  
  strokeWeight(dim * 0.0025);
  stroke(255);
  noFill();

  // Draw waveform if playing  
  if (playing) {
    const values = analyser.getValue();

    beginShape();
    for (let i = 0; i < values.length; i++) {
      const amplitude = values[i];
      const x = map(i, 0, values.length - 1, 0, width);
      const y = height / 2 + amplitude * height;
      // Place vertex
      vertex(x, y);
    }
    endShape();
  }
  
  // Draw a 'play' or 'stop' button
  noStroke();
  fill(255);
  polygon(width / 2, height / 2, dim * 0.1, playing ? 4 : 3, playing ? PI / 4 : 0);
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
  
  // Small detail here: clear the screen to black and then
  // force a re-draw so there is no blur
background('rgba(70,109,114, 0.3)');
  redraw();
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
