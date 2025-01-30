// Name: Christopher McColloster
// Date: 1/30/25
// Class: CSC 2463
// Teacher: Andrew Webb
// Assignment: 1.2 Paint App

let colors, selectedColor;

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
  background(color(200)); // Background/canvas is Light grey
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
  textStyle(BOLD)
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
    }

    // Check if the clear button is clicked
    if (mouseY > height - 60) 
    {
      background(color(200));
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
  }

  // Prevents drawUI from being painted over
  drawUI();
}