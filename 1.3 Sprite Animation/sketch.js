// Name: Christopher McColloster
// Date: 2/10/25
// Class: CSC 2463
// Teacher: Andrew Webb
// Assignment: 1.3 Sprite Animation

// Arrays to store multiple sprite animations
var SpelunkyGuy = [];
var Green = [];
var Ninja = [];
var count = 3; // Number of sprite instances

function preload() 
{
  bgImage = loadImage("assets/GrassBackground.png");

  for (var i = 0; i < count; i++) 
  {
    // Create new spriteAnimation objects and store them in arrays
    SpelunkyGuy[i] = new spriteAnimation("assets/SpelunkyGuy.png", random(560) + 50, random(560) + 25);
    Green[i] = new spriteAnimation("assets/Green.png", random(560) + 50, random(560) + 25);
    Ninja[i] = new spriteAnimation("assets/Ninja.png", random(560) + 50, random(560) + 25);
  }
}

function setup() 
{
  createCanvas(640, 640);
  imageMode(CENTER);
}

function draw() 
{
  // Draw background image
  image(bgImage, width / 2, height / 2, width, height); 

  // Loop through each sprite and draw them
  for (var i = 0; i < count; i++) 
  {
    SpelunkyGuy[i].draw();
    Green[i].draw();
    Ninja[i].draw();
  }
}

// Class to create sprite animation objects
class spriteAnimation 
{
  constructor(spriteName, x, y) 
  {
    this.spritesheet = loadImage(spriteName); // Load sprite sheet
    this.frame = 0; // Current animation frame
    this.x = x;
    this.y = y;
    this.moving = 0; // Movement state (0 = idle, 1 = move right, -1 = move left)
    this.facing = 1; // Facing state (1 = face right, -1 = face left)
  }

  draw() 
  {
    push(); // Save the current drawing settings
    translate(this.x, this.y); // Move sprite to its position

    // Flip sprite if facing left
    if (this.facing < 0) 
    {
      scale(-1, 1);
    }

    // Adjust the drawing position when flipped
    let drawX = (this.facing < 0) ? -40 : 0; 

    if (this.moving === 0) 
    {
      image(this.spritesheet, 0, 0, 80, 80, 0, 0, 80, 80); // Draw idle frame
    } 
    else 
    {
      // Walking animation
      image(this.spritesheet, 0, 0, 80, 80, (this.frame + 1) * 80, 0, 80, 80); // Draw walking animation

      if (frameCount % 4 === 0) 
      {
        this.frame = (this.frame + 1) % 8;
        this.x += 6 * this.moving;

        // Reverse direction if hitting the screen edge
        if (this.x < 40 || this.x > width - 40) 
        {
          this.moving = -this.moving;
          this.facing = -this.facing;
        }
      }
    }
    pop();  // Restore transformation settings
  }

  stop() 
  {
    this.moving = 0;
    this.frame = 3; // Set to idle frame
  }

  go(direction) 
  {
    this.moving = direction;
    this.facing = direction;
  }
}


// Handle key press events
function keyPressed() 
{
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) 
  {
    let direction = (keyCode === RIGHT_ARROW) ? 1 : -1; // Determine direction

    for (var i = 0; i < count; i++) 
    {
      SpelunkyGuy[i].go(direction);
      Green[i].go(direction);
      Ninja[i].go(direction);
    }
  }
}


// Handle key release events
function keyReleased() 
{
  // Stop all sprites when the right or left arrow key is released
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) 
  {
    for (var i = 0; i < count; i++) 
    {
      SpelunkyGuy[i].stop();
      Green[i].stop();
      Ninja[i].stop();
    }
  }
}