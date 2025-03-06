// Name: Christopher McColloster
// Date: 3/05/25
// Class: CSC 2463
// Teacher: Andrew Webb
// Assignment: 2.2 Build a Synthesizer
// I am using the code created in class by our TA
// Treya Nash as a starting point.

let synth, filter, slider;
let currentKey = "";

function setup() {
  createCanvas(400, 300);
  
  // Create a polyphonic synthesizer
  synth = new Tone.PolySynth(Tone.Synth).toDestination();
  
  // Create a low-pass filter
  filter = new Tone.Filter(1000, "lowpass").toDestination();
  synth.connect(filter);
  
  // Create a slider to control the filter frequency
  slider = createSlider(200, 2000, 1000);
  slider.position(20, 250);
}

function draw() {
  background(50);
  fill(255);
  textSize(16);
  text("Press A-K to play notes", 20, 50);
  text("Move the slider to adjust the filter frequency", 20, 240);
  
  // Update filter frequency based on slider value
  filter.frequency.value = slider.value();

  // Display the currently pressed key
  textSize(32);
  text(currentKey, width / 2, height / 2);
}

function keyPressed() {
  let notes = {
    'A': 'C4', 
    'S': 'D4', 
    'D': 'E4', 
    'F': 'F4', 
    'G': 'G4', 
    'H': 'A4', 
    'J': 'B4', 
    'K': 'C5'
  };
  
  let note = notes[key.toUpperCase()];
  if (note) {
    synth.triggerAttack(note);
    currentKey = key.toUpperCase();
  }
}

function keyReleased() {
  let notes = {
    'A': 'C4', 'S': 'D4', 'D': 'E4', 'F': 'F4', 'G': 'G4', 'H': 'A4', 'J': 'B4', 'K': 'C5'
  };
  
  let note = notes[key.toUpperCase()];
  if (note) {
    synth.triggerRelease(note);
    currentKey = "";
  }
}