// Name: Christopher McColloster
// Date: 4/15/25
// Class: CSC 2463
// Teacher: Andrew Webb
// Assignment: 3.3 Serial Communication

let port, connectButton, recChar, potentVal, message;
let toggleState = false;
let analogVal = 0;
let serialBuffer = "";

function setup() {
  createCanvas(400, 400);
  port = createSerial();
  connectButton = createButton("Connect to Arduino");
  connectButton.mousePressed(connectToSerial);
}

function draw() {

  // Reads incoming serial data and waits for a newline.
  // Then, it converts it into a usable number that is 
  // used to make the block be lighter or darker
  // depending on the potentiometer's dial level.
  while (port.available()) 
  {
    recChar = port.read();
    if (recChar === '\n') 
    {
      potentVal = int(trim(serialBuffer));
      if (!isNaN(potentVal)) 
      {
        analogVal = potentVal;
      }
      serialBuffer = "";
    } 
    else 
    {
      serialBuffer += recChar;
      console.log("Potent lvl: ", recChar);
    }
  }

  background(map(analogVal, 0, 1023, 0, 255));
  fill(0);
  textSize(16);
  textAlign(CENTER);
  text("Click to turn ON/OFF LED", width / 2, height / 2);
}

function mousePressed() 
{
  toggleState = !toggleState;
  message = toggleState ? "ON\n" : "OFF\n";
  port.write(message);
}

function connectToSerial() 
{
  port.open('Arduino', 9600);
}
