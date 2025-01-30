// Name: Christopher McColloster
// Date: 2/1/25
// Class: CSC 2463
// Teacher: Andrew Webb
// Assignment: 1.3 Sprite Animation

let chiyo;
let rot = 0;
let score = 0;
let time = 30;

function preload() {
  chiyo = loadImage('assets/Chiyo.png');
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
  angleMode(DEGREES);
  textSize(30);
}

function draw() {
  background(220);

  text("Score: " + score, 10, 30);

  push();
  translate(200, 200);
  rotate(rot);
  image(chiyo, 0, 0);
  pop();

  text("Time: " + time, 275, 30);

  rot += 5;

  if(rot >= 360)
  {
    rot -=360;
  }
  
  if(frameCount % 60 === 0)
  {
    time--;
    if(time === -1)
    {
      noLoop();
    }
  }

}

function keyTyped()
{
  if(key === ' ')
  {
    if (rot >= 340 || rot <= 10)
    {
      score++;
    }
    else
    {
      score--;
    }
  }
}
  