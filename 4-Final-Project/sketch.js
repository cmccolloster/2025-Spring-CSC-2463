// Name: Christopher McColloster
// Date: 5/5/25
// Class: CSC 2463
// Teacher: Andrew Webb
// Assignment: Final Project

let genres = {
  Rock: ['American-Idiot.mp3', 'All-the-Small-Things.mp3'],
  Pop: ['Hey-Ya.mp3', 'Bye-Bye-Bye.mp3'],
  Alternative: ['Better-Off-Alone.mp3', 'Call-on-Me.mp3']
};

let port, serial, connectButton, recChar;
let latestData = '';
let serialBuffer = "";
let gainNode = new Tone.Gain(0.5).toDestination(); // 0.5 is the initial volume (50%)

let startContext, volumeSlider;
let currentGenre = 'Rock';
let currentSong = null;
let currentIndex = 0;
let isPlaying = false;

let cdImages = {};
let angle = 0;

function preload() {
  playlist = genres[currentGenre].map(song => new Tone.Player(`assets/${song}`).connect(gainNode));
  cdImages = {
    'American-Idiot.mp3': loadImage('assets/AmericanIdiot.png'),
    'All-the-Small-Things.mp3': loadImage('assets/AllTheSmallThings.png'),
    'Hey-Ya.mp3': loadImage('assets/HeyYa.png'),
    'Bye-Bye-Bye.mp3': loadImage('assets/ByeByeBye.png'),
    'Better-Off-Alone.mp3': loadImage('assets/BetterOffAlone.png'),
    'Call-on-Me.mp3': loadImage('assets/CallOnMe.png')
  };
}

function setup() {
  createCanvas(600, 1000);
  noStroke();
  textAlign(CENTER, CENTER);

  port = createSerial();
  connectButton = createButton('Connect to Arduino');
  connectButton.position(10, 40);
  connectButton.mousePressed(connectToSerial);

  startContext = createButton("Start Audio Context");
  startContext.position(10, 10);
  startContext.mousePressed(startAudioContext);

  volumeSlider = createSlider(0, 1, 0.5, 0.01);
  volumeSlider.position(235, 550);
  volumeSlider.style('width', '125px');

  let genreButton1, genreButton2, genreButton3;
  genreButton1 = createButton('Rock').mousePressed(() => changeGenre('Rock'));
  genreButton1.position(175, 650);
  genreButton2 = createButton('Pop').mousePressed(() => changeGenre('Pop'));
  genreButton2.position(380, 650);
  genreButton3 = createButton('Alternative').mousePressed(() => changeGenre('Alternative'));
  genreButton3.position(260, 750);
}

function draw() {
  background(220);

  // iPod body
  fill(245);
  rect(100, 100, 400, 800, 60); // 2× size

  // Screen frame
  fill(30);
  rect(150, 160, 300, 200, 20);

  // Actual screen
  fill(0);
  rect(160, 170, 280, 180, 16);

  // Click wheel outer
  fill(230);
  ellipse(300, 660, 280, 280); // 2× 140

  // Center button
  fill(245);
  ellipse(300, 660, 120, 120); // 2× 60

  // Labels
  fill(60);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Volume", 300, 580);     // Top

  let songName = genres[currentGenre][currentIndex];
  let cdImage = cdImages[songName];

  // Draw rotating CD
  push();
  translate(width / 2, height / 2 - 40);
  translate(0, -200);
  if (isPlaying) { angle += 0.05; }
  rotate(angle);
  imageMode(CENTER);
  if (cdImage) { image(cdImage, 0, 0, 190, 190); }
  pop();

  if (currentSong && currentSong.buffer.loaded) 
  {
    const elapsed = isPlaying ? (Tone.now() - songStartTime + offset) : offset;
    const remaining = Math.max(0, duration - elapsed);
    text(`Now Playing: ${genres[currentGenre][currentIndex]}`, width / 2, 380);
    text(`Time Left: ${formatTime(remaining)}`, width / 2, 140);
  } 
  else 
  {
    text(`Select a genre and press play`, width / 2, 380);
  }

  while (port.available()) 
  {
    recChar = port.read();
    if (recChar.startsWith('P')) 
    {
      togglePlay();
      console.log("Pressed Pause/Play Button");
    } 
    else if (recChar.startsWith('N')) 
    {
      nextSong();
      console.log("Pressed Next Button");
    } 
    else if (recChar.startsWith('B')) 
    {
      previousSong();
      console.log("Pressed Back Button");
    } 
    else if (recChar.startsWith('V')) 
    {
      console.log('Volume: ', recChar);
      let raw = recChar.substring(1);
      let mapped = map(raw, 0, 1023, 0, 1);
      volumeSlider.value(mapped);
      gainNode.gain.value = mapped;  // Directly set the gain value
    }
    serialBuffer = "";
  }
}

function connectToSerial() 
{
  port.open('Arduino', 9600);
}

async function togglePlay() {
  if (!currentSong) 
  {
    loadAndPlay();
  } 
  else if (isPlaying) 
  {
    offset += Tone.now() - songStartTime;  // Accumulate how much has played
    currentSong.stop();
    isPlaying = false;
  } 
  else 
  {
    currentSong.start('+0', offset);       // Resume from where left off
    songStartTime = Tone.now();            // Track when resumed
    isPlaying = true;
  }
}

function nextSong() {
  if (currentSong) 
  {
    currentSong.stop();
  }
  offset = 0;
  currentIndex = (currentIndex + 1) % genres[currentGenre].length;
  loadAndPlay();
}

function changeGenre(genre) {
  currentGenre = genre;
  currentIndex = Math.floor(Math.random() * genres[genre].length);
  if (currentSong) 
  {
    currentSong.stop();
  }
  offset = 0;
  loadAndPlay();
  sendGenreToArduino(`GENRE:${genre}`);
}

function sendGenreToArduino(msg) {
  if (!port.opened()) return;
    port.write(msg);
}

function loadAndPlay() {
  const songPath = `assets/${genres[currentGenre][currentIndex]}`;
  currentSong = new Tone.Player(songPath, () => {
    currentSong.connect(gainNode);
    duration = currentSong.buffer.duration;
    offset = 0;
    currentSong.start();
    songStartTime = Tone.now();
    isPlaying = true;
  });
}

function previousSong() {
  if (currentSong) 
  {
    currentSong.stop();
  }
  offset = 0;
  currentIndex = (currentIndex - 1 + genres[currentGenre].length) % genres[currentGenre].length;
  loadAndPlay();
}

function seek(seconds) {
  if (!currentSong || !currentSong.buffer.loaded) return;

  offset += Tone.now() - songStartTime;
  let newOffset = offset + seconds;
  newOffset = constrain(newOffset, 0, duration);

  currentSong.stop();
  currentSong.start('+0', newOffset);
  songStartTime = Tone.now();
  offset = newOffset;
}

function startAudioContext() {
  if (Tone.context.state != 'running') 
  {
    Tone.start();
    console.log("Audio Context Started");
  } 
  else 
  {
    console.log("Audio Context is already running");
  }
}

function formatTime(t) {
  let min = floor(t / 60);
  let sec = floor(t % 60);
  return `${min}:${nf(sec, 2)}`;
}