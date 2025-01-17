// Name: Christopher McColloster
// Date: 1/17/25
// Class: CSC 2463
// Teacher: Andrew Webb
// Assignment: 1.1 Drawing with P5 

function setup() {
  createCanvas(280, 700);
  colorMode(HSB);
}

function draw() {
  // Example 1
  noStroke(); // Green rectangle
  fill('rgb(0%, 255% , 0%)');
  rect(10,10,250,120);
  
  stroke(0);
  strokeWeight(1);
  fill(255);
  circle(70,70,100);
  square(150,20,100);

  // Example 2
  noStroke();
  fill(0, 35, 100, .5);
  circle(140,200,100); // Red sphere
  
  fill(100, 35, 100, .5);
  circle(170,250,100); // Green sphere
  
  fill(255, 35, 100,.5);
  circle(105,250,100);  // Blue sphere
  
  // Example 3
  fill('rgba(0, 0, 0, 255)'); // Black rectangle
  rect(10,320,250,120);
  
  fill('rgba(255, 255, 0, 255)');
  arc(70, 380, 100, 100, (7 * PI) / 5.7, PI / .148); // Pac-Man

  fill('rgba(255,0,0,255)');
  rect(140, 330, 100, 100, 60, 60, 0, 0); // Blinky
  
  stroke('rgb(255%, 255% , 255%)'); // Left eye
  strokeWeight(5);
  fill('rgba(0, 0, 255, 255)');
  circle(165,380,25);

  fill('rgba(0, 0, 255, 255)'); // Right eye
  circle(215,380,25);

  // Example 4
  noStroke();
  fill('rgba(0, 0, 127, 255)'); // Blue square
  square(10, 450, 250);

  fill('rgba(0, 127, 0, 255)'); // Green circle with outline
  stroke('rgb(255%, 255% , 255%)');
  strokeWeight(3);
  circle(135, 565, 130);

  fill('rgb(255%, 0%, 0%)'); // Red star with outline
  beginShape();
    vertex(200, 545);
    vertex(155, 545);
    vertex(138, 497);
    vertex(115, 545);
    vertex(70, 545);
    vertex(107, 576);
    vertex(93, 615);
    vertex(135, 593);
    vertex(177, 615);
    vertex(163, 576);
  endShape(CLOSE);
}