// Name: Christopher McColloster
// Date: 3/17/25
// Class: CSC 2463
// Teacher: Andrew Webb
// Assignment: 2.4 Final Sound Assignment
// Using my code from 1.2 Paint App and adding onto it

let colors, selectedColor, synth, bgSynth, colorNotes;

function setup() 
{
  createCanvas(900, 600);

  // Color palette array
  colors = 
  [
    color('Red'), 
    color('Orange'), 
    color('Yellow'), 
    color('Green'), 
    color('Cyan'), 
    color('Blue'), 
    color('Purple'), 
    color('Brown'), 
    color('White'), 
    color('Black')
  ];

  selectedColor = colors[0]; // Default color is Red
  
  // Assign each color a musical note
  colorNotes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5"];
  
  background(230); // Background/canvas is Light grey
  
  // Initialize Tone.js synths
  synth = new Tone.Synth().toDestination();
  bgSynth = new Tone.PolySynth(Tone.Synth).toDestination();
  
  // Start background ambient music with random octave shifts
  Tone.Transport.scheduleRepeat((time) => 
  {
    let baseNotes = ["C", "E", "G"];
    let octaveShift = random([2, 3, 4, 5]); // Random octave between 2 and 5
    let notes = baseNotes.map(n => n + octaveShift);
    bgSynth.triggerAttackRelease(notes, "4n", time);
  }, "2n");

  Tone.Transport.start();
}

function drawUI() 
{
  // Color Palette Buttons
  for (let i = 0; i < colors.length; i++) 
  {
    fill(colors[i]);
    strokeWeight(0);
    square(10, (i * 40) + 10, 35);
  }
  
  // Clear Button
  fill(255);
  stroke(0);
  square(10, height - 60, 40);
  fill(0);
  textSize(15);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("Clear", 30, height - 40);
}

function mousePressed() 
{
  // Check if clicked inside the sidebar
  if (mouseX < 60) 
  {
    let index = floor((mouseY - 10) / 40);

    // Select a color if a valid color box is clicked
    if (index >= 0 && index < colors.length) 
    {
      selectedColor = colors[index];
      let note = colorNotes[index];
      synth.triggerAttackRelease(note, "8n"); // Play assigned note for the color
    }

    // Check if the clear button is clicked
    if (mouseY > height - 60) 
    {
      background(230);
      synth.triggerAttackRelease("G2", "8n"); // Play a low note for clearing
    }
  }
}

function draw() 
{
  if (mouseIsPressed && mouseX > 60) 
  {
    stroke(selectedColor);
    strokeWeight(10);
    line(pmouseX, pmouseY, mouseX, mouseY);
    
    let index = colors.indexOf(selectedColor);
    let note = colorNotes[index];
    synth.triggerAttackRelease(note, "8n"); // Play a sound while drawing
  }

  // Prevents drawUI from being painted over
  drawUI();
}