// Name: Christopher McColloster
// Date: 3/05/25
// Class: CSC 2463
// Teacher: Andrew Webb
// Assignment: 2.2 Build a Synthesizer

let synth, filter, freqSlider, octaveSlider;
let pressedKeys = new Set();
let baseOctave = 4;
let isPlaying = false;
let timeouts = [];
let notes = {
    'A': 'C', 
    'S': 'D', 
    'D': 'E', 
    'F': 'F', 
    'G': 'G', 
    'H': 'A', 
    'J': 'B', 
    'K': 'C'
  };

function setup() {
  createCanvas(400, 400);

  // Create a polyphonic synthesizer
  synth = new Tone.PolySynth(Tone.Synth).toDestination();

  // Create a low-pass filter
  filter = new Tone.Filter(1000, "lowpass").toDestination();
  synth.connect(filter);

  // Frequency slider
  freqSlider = createSlider(200, 2000, 1000);
  freqSlider.position(20, 250);

  // Octave slider (-1 to +1)
  octaveSlider = createSlider(-1, 1, 0, 1); 
  octaveSlider.position(20, 350);
}

function draw() {
  background(150);
  fill(255);
  textSize(16);
  text("Press A-K to play notes", 20, 50);
  text("Move the slider to adjust the filter frequency", 20, 240);
  text("Adjust Octave (-1, 0, +1)", 20, 340);
  // text("Auto-play: " + (isPlaying ? "ON" : "OFF"), 20, 330);

  // Update filter frequency based on slider value
  filter.frequency.value = freqSlider.value();

  // Get the octave shift from the slider
  baseOctave = 4 + octaveSlider.value();

  // Display currently pressed keys
  textSize(32);
  text([...pressedKeys].join(" "), width / 2 - 50, height / 2);
}

function keyPressed() {
  let keyNote = notes[key.toUpperCase()];
  if (keyNote && !pressedKeys.has(key.toUpperCase())) 
  {
    let note = key.toUpperCase() === 'K' ? keyNote + (baseOctave + 1) : keyNote + baseOctave;
    synth.triggerAttack(note);
    pressedKeys.add(key.toUpperCase());
  }
}

function keyReleased() {
  let keyNote = notes[key.toUpperCase()];
  if (keyNote) 
  {
    let note = key.toUpperCase() === 'K' ? keyNote + (baseOctave + 1) : keyNote + baseOctave;
    synth.triggerRelease(note);
    pressedKeys.delete(key.toUpperCase());
  }
}