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

// preload() is called before setup() and is used to load assets
function preload() 
{
  bgImage = loadImage("assets/GrassBackground.png");
  for (var i = 0; i < count; i++) 
  {
    // Create new spriteAnimation objects and store them in arrays
    SpelunkyGuy[i] = new spriteAnimation("assets/SpelunkyGuy.png", random(560) + 40, random(440) + 40);
    Green[i] = new spriteAnimation("assets/Green.png", random(560) + 40, random(440) + 40);
    Ninja[i] = new spriteAnimation("assets/Ninja.png", random(560) + 40, random(440) + 40);
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

// Function constructor to create sprite animation objects
function spriteAnimation(imageName, x, y) 
{
  let spritesheet = loadImage(imageName); // Load sprite sheet
  let frame = 0;
  let moving = 0;
  let facing = 0;

  function draw() 
  {
    push(); // Save the current drawing settings
    translate(x, y); // Move sprite to its position

    if (facing < 0) 
    {
      scale(-1.0, 1.0); // Flip sprite if facing left
    }

    if (moving == 0) 
    {
      image(spritesheet, 0, 0, 80, 80, 0, 0, 80, 80); // Draw idle frame
    } 
    else
    {
      
      image(spritesheet, 0, 0, 80, 80, (frame + 1) * 80, 0, 80, 80); // Draw walking animation

      if (frameCount % 4 == 0) 
      {
        frame = (frame + 1) % 8;
        x += 6 * moving;

        // Reverse direction if hitting screen edge
        if (x < 40 || x > width - 40) 
        {
          moving = -moving;
          facing = -facing;
        }
      }
    }
    pop();
  }

  function stop() 
  {
    moving = 0;
    frame = 3;
  }

  function go(direction) 
  {
    moving = direction;
    facing = direction;
  }

  // Return an object with methods to interact with the sprite
  return { draw, stop, go };
}

// Handle key press events
function keyPressed() 
{
  if (keyCode === RIGHT_ARROW) 
  {
    // Move all sprites to the right
    for (var i = 0; i < count; i++) 
    {
      SpelunkyGuy[i].go(+1);
      Green[i].go(+1);
      Ninja[i].go(+1);
    }
  }

  if (keyCode === LEFT_ARROW) 
  {
    // Move all sprites to the left
    for (var i = 0; i < count; i++) 
    {
      SpelunkyGuy[i].go(-1);
      Green[i].go(-1);
      Ninja[i].go(-1);
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