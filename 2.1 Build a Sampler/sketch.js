// Name: Christopher McColloster
// Date: 2/17/25
// Class: CSC 2463
// Teacher: Andrew Webb
// Assignment: 2.1 Build a Sampler

let sampler;

function preload()
{
  sampler = new Tone.Player("media/cat.mp3").toDestination();
}

function setup()
{
  createCanvas(400,400);
}

function draw()
{
  background(220); 
}