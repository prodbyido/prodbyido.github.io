// See the 'assets' folder for our MP3 file URL
const MP3 = "../IDO.wav";
// const MP3 = 'https://cdn.glitch.com/239c0770-a81a-480b-9e0b-e5510a0738d7%2FPilotpriest%20-%20Matter.mp3?v=1571090488415'
// Master volume in decibels
const volume = 0;

let player, analyser;

let playing = false;

// Create a new canvas to the browser size
async function setup() {
  createCanvas(windowWidth, windowHeight);

  // Clear with black on setup
  background(0);

  // Make the volume quieter
  Tone.Master.volume.value = volume;

  // We can use 'player' to
  player = new Tone.Player();
  player.loop = true;
  player.autostart = false;
  player.loopStart = 0;

  // Load and "await" the MP3 file
  await player.load(MP3);

  // Create an analyser node that makes a waveform
  analyser = new AudioEnergy();

  // Connect with analyser as well so we can detect waveform
  player.connect(analyser);
  player.connect(Tone.Master);
}

// On window resize, update the canvas size
function windowResized() {
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

  // Update the analyser
  analyser.update();

  // Draw FFT values
  strokeWeight(dim * 0.0025);
  stroke(255);
  noFill();

  if (playing) {
    const diameter = dim * 0.4;
    const rings = [
      { name: 'bass', color: 'pink' },
      { name: 'lowMid', color: 'orange' },
      { name: 'mid', color: 'yellow' },
      { name: 'highMid', color: 'cyan' },
      { name: "treble", color: "tomato" }
    ];
    for (let i = 0; i < rings.length; i++) {
      const ring = rings[i];
      const hexColor = ring.color;
      const name = ring.name;

      const energy = analyser.getEnergy(name);
      stroke(hexColor);
      const scale = map(energy, -100, -30, 0, 1);
      
      const finalDiameter = diameter + scale * diameter;
      circle(width / 2, height / 2, finalDiameter);
      
      push();
      translate(width / 2, height / 2);
      rotate(i * PI / 12);
      translate(-width / 2, -height / 2);
      
      noStroke();
      fill(hexColor);


      textSize(dim * 0.025);
      textFont('Courier New');
		if(name == 'bass'){
			text('低音', width / 2 + finalDiameter / 2 + 10, height / 2);
		}else if(name == 'lowMid'){
			text('中低音', width / 2 + finalDiameter / 2 + 10, height / 2);
		}else if(name == 'mid'){
			text('中音', width / 2 + finalDiameter / 2 + 10, height / 2);
		}else if(name == 'highMid'){
			text('中高音', width / 2 + finalDiameter / 2 + 10, height / 2);
		}else if(name == 'treble'){
			text('高音', width / 2 + finalDiameter / 2 + 10, height / 2);
		}
      pop();
    }
  }

  
  // Draw a 'play' or 'stop' button
  noStroke();
  fill(255);
  polygon(
    width / 2,
    height / 2,
    dim * 0.1,
    playing ? 4 : 3,
    playing ? PI / 4 : 0
  );
}

function mousePressed() {
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
