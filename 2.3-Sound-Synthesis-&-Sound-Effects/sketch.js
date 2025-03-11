let imgBlock, imgHit, imgAfterHit;
let oscCoin, oscThud, noise, filter, lfo, osc;
let blockState = "default";
let blockHit = 0;
let audioStarted = false;

function preload() {
  imgBlock = loadImage('coinBlock.png');
  imgHit = loadImage('coinBlockHit.png');
  imgAfterHit = loadImage('coinBlockAfterHit.png');
}

function setup() {
  createCanvas(400, 400);

  // Coin sound (high-pitched with FM synthesis)
  osc = new Tone.FMSynth({
    harmonicity: 8,
    modulationIndex: 2,
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0,
      release: 0.1
    }
  }).toDestination();

  // Coin sound (high-pitched) - Change from Oscillator to Synth
  oscCoin = new Tone.Synth({
    oscillator: {
      type: "sine",
      frequency: 1200
    },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0,
      release: 0.1
    }
  }).toDestination();

  envCoin = new Tone.AmplitudeEnvelope({
    attack: 0.01,
    decay: 0.2,
    sustain: 0,
    release: 0.1
  }).toDestination();
  oscCoin.connect(envCoin);

  // Thud sound (low-pitched with noise and filter)
  oscThud = new Tone.Oscillator(200, "square").start();
  noise = new Tone.Noise("white").start();
  filter = new Tone.Filter(500, "lowpass").toDestination();
  oscThud.connect(filter);
  noise.connect(filter);

  // LFO for modulating the thud sound
  lfo = new Tone.LFO(5, 200, 400).start(); // Modulate frequency between 200 and 400 Hz
  lfo.connect(oscThud.frequency);

  // Envelope for the thud sound
  envThud = new Tone.AmplitudeEnvelope({
    attack: 0.01,
    decay: 0.3,
    sustain: 0,
    release: 0.2
  }).toDestination();
  oscThud.connect(envThud);
  noise.connect(envThud);
}

function draw() {
  background(220);
  textAlign(CENTER, CENTER);
  textSize(16);
  fill(0);
  text("Click to hit the block!", width / 2, 50);

  // Display the block based on its state
  if (blockState === "default") {
    image(imgBlock, width / 2 - 50, height / 2 - 50, 100, 100);
  } else if (blockState === "hit") {
    image(imgHit, width / 2 - 50, height / 2 - 50, 100, 100);
  } else if (blockState === "afterHit") {
    image(imgAfterHit, width / 2 - 50, height / 2 - 50, 100, 100);
  }
}

function mousePressed() {
  // Check if the mouse is within the block's bounds
  const blockX = width / 2 - 50;
  const blockY = height / 2 - 50;
  const blockSize = 100;

  if (
    mouseX >= blockX &&
    mouseX <= blockX + blockSize &&
    mouseY >= blockY &&
    mouseY <= blockY + blockSize
  ) {
    // Start AudioContext if it hasn't been started yet
    if (!audioStarted) {
      Tone.start(); // Start the AudioContext
      audioStarted = true;
      console.log("AudioContext started!");
    }

    // Play sounds only if AudioContext is started
    if (audioStarted) {
      if (blockHit < 5) {
        oscCoin.triggerAttackRelease("C6", "8n"); // Play FM synth for coin sound
        blockHit++; // Increase hit count
      } else {
        envThud.triggerAttackRelease(0.3); // Play thud sound with noise and filter
      }

      // Change the block state after being hit
      if (blockHit < 5) {
        blockState = "hit"; // Block is hit
      } else {
        blockState = "afterHit"; // Block after 5 hits
      }
    }
  }
}

function mouseReleased() {
  // After mouse release, show the correct block state
  if (blockHit < 5) {
    blockState = "default"; // If it's less than 5 hits, return to the default image
  } else {
    blockState = "afterHit"; // After 5 hits, show after-hit image
  }
}
