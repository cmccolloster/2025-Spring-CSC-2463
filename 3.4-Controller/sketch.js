// Name: Christopher McColloster
// Date: 4/22/25
// Class: CSC 2463
// Teacher: Andrew Webb
// Assignment: 3.4 Controller

let colors, selectedColor, synth, bgSynth, colorNotes;
let port, connectButton, serialBuffer = "";
let brushX = 450, brushY = 300, brushSize = 20;
let nextColorIndex = 0;
let serialData = { x: null, y: null }; // Initialize as null
let lastValidPosition = { x: 450, y: 300 }; // Stores last good position
let lastUpdateTime = 0;

function setup() {
  createCanvas(900, 600);
  frameRate(144); // Keep high frame rate for smoothness


  // Serial setup
  port = createSerial();
  connectButton = createButton("Connect to Arduino");
  connectButton.position(10, height + 10);
  connectButton.mousePressed(connectToSerial);

  colors = [
    color('Red'), color('Orange'), color('Yellow'), color('Green'),
    color('Cyan'), color('Blue'), color('Purple'), color('Brown'),
    color('White'), color('Black')
  ];
  
  colorNotes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5"];
  selectedColor = colors[0];
  background(230);

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

function connectToSerial() {
  port.open('Arduino', 9600);
  port.clear();
}

function draw() {
  // Process serial data
  let serialString = port.readUntil('\n');
  if (serialString.length > 0) {
    handleSerial(serialString.trim());
    lastUpdateTime = millis(); // Mark when we last got good data
  }

  // Only update position if we have recent data
  if (serialData.x !== null && serialData.y !== null) 
  {
    let targetX = map(serialData.x, 0, 1023, 60, width);
    let targetY = map(serialData.y, 0, 1023, 0, height);
    
    // Smooth movement only when actively receiving data
    brushX = lerp(brushX, targetX, 0.3);
    brushY = lerp(brushY, targetY, 0.3);
    
    // Update last valid position
    lastValidPosition.x = brushX;
    lastValidPosition.y = brushY;
  } 
  else 
  {
    // Use last valid position when data is stale
    brushX = lastValidPosition.x;
    brushY = lastValidPosition.y;
    serialData.x = null; // Mark data as stale
    serialData.y = null;
  }

  // Draw UI and brush cursor
  drawUI();
  drawBrushCursor();
}

function handleSerial(data) {
  console.log("Received:", data);
  
  // Handle potentiometer (brush size)
  if (!isNaN(data)) 
  {
    brushSize = map(int(data), 0, 1023, 5, 50);
    return;
  }
  
  // Handle joystick movement
  if (data.startsWith("X:")) 
  {
    let parts = data.split(',');
    if (parts.length >= 2) {
      serialData.x = int(parts[0].substring(2));
      serialData.y = int(parts[1].substring(2));
    }
  }
  // Handle color change
  else if (data === "COLOR_CHANGE") 
  {
    nextColorIndex = (nextColorIndex + 1) % colors.length;
    selectedColor = colors[nextColorIndex];
    sendColorToArduino(selectedColor);
  }
}

function drawBrushCursor() {
  fill(selectedColor);
  noStroke();
  circle(brushX, brushY, brushSize);
}

function sendColorToArduino(c) {
  if (!port.opened()) return;
    port.write(red(c));
    port.write(green(c));
    port.write(blue(c));
}

function drawUI() {
  // Color palette
  for (let i = 0; i < colors.length; i++) 
  {
    fill(colors[i]);
    noStroke();
    square(10, (i * 40) + 10, 35);
  }

  // Clear button
  fill(255);
  stroke(0);
  square(10, height - 60, 40);
  fill(0);
  textSize(15);
  textAlign(CENTER, CENTER);
  text("Clear", 30, height - 40);
}

function mousePressed() {
  // Clear button
  if (mouseX < 60 && mouseY > height - 60) 
  {
    background(230);
    synth.triggerAttackRelease("G2", "8n");
  }
  // Color selection
  else if (mouseX < 60) 
  {
    let index = floor((mouseY - 10) / 40);
    if (index >= 0 && index < colors.length) 
    {
      selectedColor = colors[index];
      sendColorToArduino(selectedColor);
    }
  }
}