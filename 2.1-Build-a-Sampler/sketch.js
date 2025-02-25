// Name: Christopher McColloster
// Date: 2/25/25
// Class: CSC 2463
// Teacher: Andrew Webb
// Assignment: 2.1 Build a Sampler
// I am using the code created in class by our TA
// Treya Nash as a starting point.

let startContext, samples;
let buttons = [];
let delTimeSlider, feedbackSlider, distSlider, wetSlider;

let rev = new Tone.Reverb(5).toDestination();
let dist = new Tone.Distortion(0).connect(rev);
let del = new Tone.FeedbackDelay(0, 0).connect(dist);
del.wet.value = 0.5;

function preload() 
{
  samples = new Tone.Players({
    cat: "media/cat.mp3",
    seagull: "media/seagulls.mp3",
    dog: "media/dog.mp3",
    bell: "media/bell.mp3"
  }).connect(del);
}

function setup() 
{
  createCanvas(400, 400);

  startContext = createButton("Start Audio Context");
  startContext.position(10, 10);
  startContext.mousePressed(startAudioContext);

  let sampleNames = ["cat", "seagull", "dog", "bell"];
  for (let i = 0; i < sampleNames.length; i++) 
  {
    let button = createButton(`Play ${sampleNames[i]} Sample`);
    button.position(10, 50 + i * 40);
    button.mousePressed(() => {samples.player(sampleNames[i]).start()});
    buttons.push(button);
  }
  
  delTimeSlider = createSlider(0, 1, 0, 0.01);
  delTimeSlider.position(10, 220);
  delTimeSlider.input(() => {del.delayTime.value = delTimeSlider.value()});

  feedbackSlider = createSlider(0, 0.99, 0, 0.01);
  feedbackSlider.position(200, 220);
  feedbackSlider.input(() => {del.feedback.value = feedbackSlider.value()});

  distSlider = createSlider(0, 10, 0, 0.01);
  distSlider.position(10, 270);
  distSlider.input(() => {dist.distortion = distSlider.value()});

  wetSlider = createSlider(0, 1, 0, 0.01);
  wetSlider.position(200, 270);
  wetSlider.input(() => {rev.wet.value = wetSlider.value()});
}

function draw() 
{
  background(220);
  text("Delay Time: " + delTimeSlider.value(), 15, 210);
  text("Feedback Amount: " + feedbackSlider.value(), 205, 210);
  text("Distortion Amount: " + distSlider.value(), 15, 260);
  text("Reverb Wet Amount: " + wetSlider.value(), 205, 260);
}

function startAudioContext() 
{
  if (Tone.context.state != 'running') 
  {
    Tone.start();
    console.log("Audio Context Started")
  } 
  else 
  {
    console.log("Audio Context is already running")
  }
}