// Name: Christopher McColloster
// Date: 2/17/25
// Class: CSC 2463
// Teacher: Andrew Webb
// Assignment: 1.4 Bug Squish

let bugs = [];
let squishedCount = 0;
let timer = 30;
let gameOver = false;
let spriteSheet;
let bugFrames = [];
let squishedFrames = [];
let lastClickTime = 0;

function preload() {
  bgImage = loadImage("assets/GrassBackground.png");
  spriteSheet = loadImage('assets/Bug.png'); // Load the sprite sheet
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
  
  // Extract individual frames from the sprite sheet
  let frameWidth = spriteSheet.width / 4; // 4 columns
  let frameHeight = spriteSheet.height; // 1 row
  for (let i = 0; i < 2; i++) {
    bugFrames.push(spriteSheet.get(i * frameWidth, 0, frameWidth, frameHeight));
  }
  for (let i = 2; i < 4; i++) {
    squishedFrames.push(spriteSheet.get(i * frameWidth, 0, frameWidth, frameHeight));
  }

  // Create initial bugs
  for (let i = 0; i < 5; i++) {
    bugs.push(new Bug(random(width), random(height)));
  }

  // Timer countdown
  setInterval(() => {
    if (timer > 0) timer--;
    else gameOver = true;
  }, 1000);
}

function draw() {
  image(bgImage, width / 2, height / 2, width, height); 

  if (!gameOver) {
    for (let bug of bugs) {
      bug.move();
      bug.display();
    }

    // Display score and timer
    fill(0);
    textSize(24);
    text(`Score: ${squishedCount}`, 20, 30);
    text(`Time: ${timer}`, width - 100, 30);
  } else {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(`Game Over!\nFinal Score: ${squishedCount}`, width / 2, height / 2);
  }
}

function mousePressed() {
  if (millis() - lastClickTime < 200) return; // Prevents click-spamming

  for (let bug of bugs) {
    if (!bug.squished && bug.isClicked(mouseX, mouseY)) {
      bug.squish();
      squishedCount++;
      bugs.push(new Bug(random(width), random(height), bug.speed + 0.5)); // New bug, harder
      lastClickTime = millis();
      break;
    }
  }
}

class Bug {
  constructor(x, y, speed = 2) {
    this.x = x;
    this.y = y;
    this.size = 40;
    this.speed = speed;
    this.angle = random(TWO_PI);
    this.squished = false;
    this.frameIndex = 0;
    this.squishFrameIndex = 0;
    this.squishTime = 0;
  }

  move() {
    if (!this.squished) {
      this.x += cos(this.angle) * this.speed;
      this.y += sin(this.angle) * this.speed;

      if (this.x < 0 || this.x > width) this.angle = PI - this.angle;
      if (this.y < 0 || this.y > height) this.angle = -this.angle;

      // Update animation frame every 10 frames
      if (frameCount % 10 === 0) {
        this.frameIndex = (this.frameIndex + 1) % 2;
      }
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    if (!this.squished) {
      rotate(this.angle + PI / 2);
      imageMode(CENTER);
      image(bugFrames[this.frameIndex], 0, 0, this.size, this.size);
    } else {
      // Display squish animation
      imageMode(CENTER);
      if (millis() - this.squishTime < 300) {
        image(squishedFrames[0], 0, 0, this.size, this.size);
      } else {
        image(squishedFrames[1], 0, 0, this.size, this.size);
      }
    }
    pop();
  }

  isClicked(mx, my) {
    return dist(mx, my, this.x, this.y) < this.size / 2;
  }

  squish() {
    this.squished = true;
    this.squishTime = millis(); // Start squish animation timing
  }
}
