// General Configuration
const NAME = "Joel Lord";
const TIMERS = [
  {duration: 0.3, blinkAt: 0.25, flashAt: 0.1},
  {duration: 5, blinkAt: 2, flashAt: 1},
  {duration: 10, blinkAt: 2, flashAt: 1},
  {duration: 15, blinkAt: 3, flashAt: 1},
  {duration: 20, blinkAt: 4, flashAt: 2},
  {duration: 30, blinkAt: 5, flashAt: 3},
  {duration: 45, blinkAt: 6, flashAt: 3},
  {duration: 60, blinkAt: 8, flashAt: 5}
];

//App level consts
var BUTTON1 = BTN1;
var BUTTON2 = BTN2;
var BUTTON3 = BTN3;
var BUTTON4 = BTN4;

const VIEWS = {
  "HELLO": "hello",
  "TIMERCONFIG": "timerconfig",
  "TIMERCOUNTDOWN": "timercountdown"
};

var timerInterval;
var blinkTimeout;
var flashTimeout;
var btnOptions = {edge: "rising", debounce: 50, repeat: true};

// Holds the state of the app
var appState = {
  "view": VIEWS.HELLO,
  timer: 0,
  timeLeft: 1,
  blinking: false,
  flashing: false
};

// This function is the main() of the app.  Gets executed every 50 ms
function drawApp() {
  // draw view
  switch (appState.view) {
    case VIEWS.HELLO:
      drawHelloMyNameIs(NAME);
      break;
    case VIEWS.TIMERCONFIG:
      drawTimerConfig();
      break;
    case VIEWS.TIMERCOUNTDOWN:
      drawTimerCountDown();
      break;
  }
  
  g.flip();
}

// Listeners for button clicks
setWatch(function() {
  if (appState.view === VIEWS.TIMERCONFIG) {
   // +  
    appState.timer += 1;
    if (appState.timer >= TIMERS.length) appState.timer = 0;
  }
}, BUTTON1, btnOptions);

setWatch(function() {
  if (appState.view === VIEWS.TIMERCONFIG) {
    appState.view = VIEWS.TIMERCOUNTDOWN;
    
    //Start timer
    appState.timeLeft = TIMERS[appState.timer].duration * 60;
    
    timerInterval = setInterval(() => {
      appState.timeLeft--;

      if (appState.timeLeft < TIMERS[appState.timer].blinkAt * 60) {
        appState.blinking = true;
        setTimeout(() => appState.blinking = false, 500);
      }

       if (appState.timeLeft < TIMERS[appState.timer].flashAt * 60) {
        appState.flashing = true;
        setTimeout(() => appState.flashing = false, 500);
      }
    }, 1000);
  }
}, BUTTON2, btnOptions);

setWatch(function() {
  if (appState.view === VIEWS.HELLO) {
    appState.view = VIEWS.TIMERCONFIG;
  } else if (appState.view === VIEWS.TIMERCONFIG) {
    appState.view = VIEWS.HELLO; 
  } else if (appState.view === VIEWS.TIMERCOUNTDOWN) {
    appState.view = VIEWS.TIMERCONFIG;
    //Stop timer
    if(timerInterval) clearInterval(timerInterval);
    appState.blinking = false;
    appState.flashing = false;
    // if (blinkTimeout) clearTimeout(blinkTimeout);
    // if (flashTimeout) clearTimeout(flashTimeout);
    LED.reset();
  }
}, BUTTON3, btnOptions);

setWatch(function() {
  if (appState.view === VIEWS.TIMERCONFIG) {
   // -  
    appState.timer -= 1;
    if (appState.timer < 0) appState.timer = TIMERS.length - 1;
  }
}, BUTTON4, btnOptions);

function addZero(number) {
  return (number < 10) ? "0" + number : number;
}

function getMinSecString(timeLeft) {
  var negative = (timeLeft < 0);

  timeLeft = Math.abs(timeLeft);
    
  var minutes = addZero(Math.floor(timeLeft / 60));
  var seconds = addZero(timeLeft % 60);
  
  var displayTime = minutes + ":" + seconds;
  return negative ? "-" + displayTime : displayTime;
}

function drawHelloMyNameIs(name) {
  g.clear();
  
  var nameExploded = name.split(" ");
  
  g.setFontVector(16);
  g.drawString(nameExploded[0], 100 - g.stringWidth(name), 20);
  g.setFontVector(16);
  g.drawString(nameExploded[1], 110 - g.stringWidth(name), 40);
  
  g.setFontBitmap();
  g.drawString("Hello, my name is", 0, 0);
  
  // menu
  g.setFontBitmap();
  g.drawString("=>", 111, 56);
}

function drawTimerConfig() {
  var timer = appState.timer;
  
  var timeLeft = getMinSecString(TIMERS[timer].duration * 60);
  
  g.clear();
  
  g.setFontBitmap();
  var title = "Timer Config";
  g.drawString(title, 90 - g.stringWidth(title), 0);
  
  g.setFontVector(24);
  g.drawString(timeLeft, 100 - g.stringWidth(timeLeft), 20);
  
  //menu
  g.setFontBitmap();
  g.drawString("(+)", 0, 8);
  g.drawString("(-)", 0, 56);
  g.drawString("(start)", 100, 8);
  g.drawString("(exit)", 103, 56);
}

function drawTimerCountDown() {
  var timeLeft = appState.timeLeft;
  var displayTime = getMinSecString(timeLeft);
  
  g.clear();
  
  g.setFontVector(24);
  g.drawString(displayTime, 100 - g.stringWidth(displayTime), 20);

  if (appState.blinking) {
    g.clear();
  }
  
  if (appState.flashing) {
    LED.set();
  } else {
    LED.reset();
  }
  
  //menu  
  g.setFontBitmap();
  var title = "Speaker Timer";
  g.drawString(title, 90 - g.stringWidth(title), 0);
  
  g.setFontBitmap();
  g.drawString("(stop)", 103, 56);
}

setInterval(drawApp, 50);