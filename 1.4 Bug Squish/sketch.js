// Name: Christopher McColloster
// Date: 2/17/25
// Class: CSC 2463
// Teacher: Andrew Webb
// Assignment: 1.4 Bug Squish

var bugs = [];
var squishedCount;
var timer;
var gameOver = false;
var gameStarted = false;
var spriteSheet;
var bugFrames = [];
var squishedFrames = [];
var lastClickTime;
var intervalID;
var bgImage;

function preload() 
{
  bgImage = loadImage("assets/GrassBackground.png");
  spriteSheet = loadImage('assets/Bug.png'); 
}

function setup() 
{
  loadBugSprites(); // Extract bug frames from sprite sheet
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
}

function draw() 
{
  image(bgImage, 0, 0, width, height); 
  textFont("Comic Sans MS");
  textAlign(CENTER, CENTER);
  fill(0);

  // Show start screen if game hasn't begun
  if (!gameStarted) 
  {
    textSize(32);
    text("Press SPACE to Start", width / 2, height / 2);
    return; // Stop draw function here until game starts
  }

  // Main game logic
  if (!gameOver) 
  {
    // Move and display each bug
    for (let bug of bugs) 
    {
      bug.move();
      bug.display();
    }

    // Display score and timer at the top of the screen
    textSize(24);
    text(`Score: ${squishedCount}`, 100, 30);
    text(`Time: ${timer}`, width - 100, 30);
  } 
  else 
  {
    // Show game over screen with final score
    textSize(32);
    text(`Game Over!\nFinal Score: ${squishedCount}\nPress SPACE to Restart`, width / 2, height / 2);
  }
}

function keyPressed() 
{
  // Start the game if SPACE is pressed and game hasn't started
  if (key === ' ' && !gameStarted) 
  {
    startGame();
  } 
  // Restart game if SPACE is pressed after game over
  else if (key === ' ' && gameOver) 
  {
    restartGame();
  }
}

function mousePressed() 
{
  // Prevent click-spamming by limiting how often clicks register
  if (!gameStarted || millis() - lastClickTime < 200) 
    {
      return;
    } 

  // Check if any bug was clicked
  for (let bug of bugs) 
  {
    if (!bug.squished && bug.isClicked(mouseX, mouseY)) 
    {
      bug.squish();
      squishedCount++;

      // Spawn a new bug that moves slightly faster
      bugs.push(new Bug(random(width), random(height), bug.speed + 0.5)); 
      lastClickTime = millis();
      break; // Prevent multiple squishes per click
    }
  }
}

function startGame() 
{
  // Reset game state
  gameStarted = true;
  gameOver = false;
  squishedCount = 0;
  timer = 30;
  bugs = [];

  // Create an initial set of bugs
  for (let i = 0; i < 5; i++) 
  {
    bugs.push(new Bug(random(width), random(height)));
  }

  // Start countdown timer
  clearInterval(intervalID);
  intervalID = setInterval(() =>
  {
    if (timer > 0) 
    {
      timer--;
    }
    else 
    {
      gameOver = true;
      clearInterval(intervalID);
    }
  }, 1000);
}

function restartGame()
{
  // Wait for spacebar press to start again
  gameStarted = false; 
}

function loadBugSprites() 
{
  let frameWidth = spriteSheet.width / 4; // 4 columns in sprite sheet
  let frameHeight = spriteSheet.height;  // 1 row in sprite sheet

  // Extract the first two frames for walking animation
  for (let i = 0; i < 2; i++) 
  {
    bugFrames.push(spriteSheet.get(i * frameWidth, 0, frameWidth, frameHeight));
  }
  
  // Extract the last two frames for squished animation
  for (let i = 2; i < 4; i++) 
  {
    squishedFrames.push(spriteSheet.get(i * frameWidth, 0, frameWidth, frameHeight));
  }
}

class Bug 
{
  constructor(x, y, speed = 2) 
  {
    this.x = x;
    this.y = y;
    this.size = 80; // Doubled the bug size from 40 to 80
    this.speed = speed;
    this.angle = random(TWO_PI); // Random initial movement direction
    this.squished = false;
    this.frameIndex = 0;
    this.squishTime = 0;
  }

  move() 
  {
    if (!this.squished) 
    {
      // Move the bug in its current direction
      this.x += cos(this.angle) * this.speed;
      this.y += sin(this.angle) * this.speed;

      // Bounce off walls by adjusting movement angle
      if (this.x < 0 || this.x > width) 
      {
        this.angle = PI - this.angle;
      }

      if (this.y < 0 || this.y > height) 
      {
        this.angle = -this.angle;
      }

      // Change animation frame every 10 frames
      if (frameCount % 10 === 0) 
      {
        this.frameIndex = (this.frameIndex + 1) % 2;
      }
    }
  }

  display() 
  {
    push();
    translate(this.x, this.y);
    imageMode(CENTER);

    if (!this.squished) 
    {
      // Rotate bug to face movement direction
      rotate(this.angle + PI / 2);
      image(bugFrames[this.frameIndex], 0, 0, this.size, this.size);
    } 
    else 
    {
      // Display squished animation
      let squishFrame = millis() - this.squishTime < 300 ? squishedFrames[0] : squishedFrames[1];
      image(squishFrame, 0, 0, this.size, this.size);
    }
    pop();
  }

  isClicked(mx, my) 
  {
    // Check if mouse click is within the bug's hitbox
    return dist(mx, my, this.x, this.y) < this.size / 2;
  }

  squish() 
  {
    this.squished = true;
    this.squishTime = millis();
  }
}
