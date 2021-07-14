var imWidth = 1959, imHeight = 1000; // hard coded image dimensions
var cnv; // canvas
var imScale; // used to adjust canvas size based on window size

var nNotes = 14; // number of note steps   */
var minValue = 30; // minimum pixel value to count as a note
var step = (256.0 - minValue) / nNotes; // pixel value step size
var pixNum = 0, pixNum0 = 0, lastPixValue = 0, lastPixValue0 = 0;

var mode, harmony, doUpdate;
var notesTunes = [];
var notesChords = [];
var notesLux = [];

var autox0 = 0, autoy0 = 0, autox = 0, autoy = 0; // initialize mouse positions */
var startX = 0, startY = 0, signX = 1, signY = 0;
var lastpixX = 0, lastpixY = 0, lastpixX0 = 0, lastpixY0 = 0, pixValue0=0;


var speed = 0.1;
var maxSpeed = 26; // doublings of 0.1 gets to 25.6
var minSpeed = 0.01; // halvings of 0.1 gets to .0125
var speedSign = 1;   // initial direction (positive is downwards)

var hubble, hubbleAuto, img, img2, hubbleImg, activeImg;

var pixValue, pixValue0;

var touchIsDown = false;

// preload background and cursor images
function preload() {
  img = loadImage("./images/finalstars.png");
  //img = loadImage("./images/testStrips.jpg");
  img2 = loadImage("./images/ngc6633_crop.jpg");
  hubbleImg = loadImage("./images/hubble_2_0.png");
  // https://science.nasa.gov/toolkits/spacecraft-icons
  soundFormats('mp3');
}



// set up canvas, background image, and cursors
function setup() {
  cnv = createCanvas(imWidth, imHeight);
  cnv.parent('canvas');
  cnv.id('cassinicanvas');

  background(0);
  img.loadPixels();  // Loads image for sound to be played from
  img2.loadPixels();
  image(img2, 0, 0);   // Sets starting display image

  hubble = new cursorIm(0, 0);
  hubbleAuto = new autoCursor(0, 0);

  init(); // load all sound files and set initial mode and harmony
}



function draw() {
  background(0);
  cnv.size(windowWidth, windowHeight);
  imScale = imWidth / windowWidth;

  document.getElementById('buttonbar').setAttribute("style", "width:100%");

  // if (harmony == 'major' && doUpdate) {
  //   image(img, 0, 0, imWidth / imScale, imHeight / imScale);  // Sets displayed image
  //   activeImg = img;  // Sets image for sonification
  //   //update = false;
  // }
  // if (harmony == 'minor' && doUpdate) {
  //   image(img, 0, 0, imWidth / imScale, imHeight / imScale);  // Sets displayed image
  //   activeImg = img; // Sets image for sonification
  //   //update = false;
  // }

  if (harmony == 'tunes') {
    image(img2, 0, 0, imWidth / imScale, imHeight / imScale);
    activeImg = img;  // Sets image for sonification
  }
  if (harmony == 'chords') {
    image(img2, 0, 0, imWidth / imScale, imHeight / imScale);
    activeImg = img;  // Sets image for sonification
  }
  if (harmony == 'lux') {
    image(img2, 0, 0, imWidth / imScale, imHeight / imScale);
    activeImg = img2;  // Sets image for sonification
    }

  if (mode == 'manual') {
    if (mouseIsPressed || touchIsDown) {

      // find current pixel number and pixel value https://p5js.org/reference/#/p5/pixels
      // pixNum = 4 * (Math.round(mouseX * imScale) + Math.round(mouseY * imScale) * imWidth); //labels pixel
      // pixValue = (img3.pixels[pixNum] + img3.pixels[pixNum + 1] + img3.pixels[pixNum + 2]) / 3.;
      // pixValue = Math.pow(pixValue / 256, 1.5) * 256; //scale brightness
      pixValue = calcPixValue(mouseX, mouseY);

      if (pixValue != lastPixValue || mouseX > (lastpixX + 10) || mouseX < (lastpixX - 10) || mouseY > (lastpixY + 10) || mouseY < (lastpixY - 10)) {
          playNotes(); // trigger note for this pixel value
	        lastpixX = mouseX;
	        lastpixY = mouseY;
      }
	    lastPixValue = pixValue;

      hubble.update(mouseX, mouseY); // update cursor postion
      hubble.show();
    }
  }

  if (mode == 'automatic') {

    autox += speedSign * speed;
    autoy += imHeight / imWidth * (speedSign * speed);
    checkBounce(); // check for bouncing off walls
    //moveRect(); // uncomment to move in rectangle, comment above 3 lines.

    // find current pixel number and pixel value
    // pixNum0 = Math.round(autox * imScale) + Math.round(autoy * imScale) * imWidth;
    // pixNum = Math.round(4 * pixNum0); //labels pixel
    // pixValue = (img.pixels[pixNum] + img.pixels[pixNum + 1] + img.pixels[pixNum + 2]) / 3.;
    // pixValue = Math.pow(pixValue / 256, 1.5) * 256; //scale brightness
    pixValue = calcPixValue(autox, autoy);
    pixValue0 = pixValue;

    if (pixValue0 != lastPixValue0 || autox > (lastpixX0 + 15) || autox < (lastpixX0 - 15) || autoy > (lastpixY0 + 15) || autoy < (lastpixY0 - 15)) {
      playNotes(); // trigger note for this pixel value
      lastpixX0 = autox;
      lastpixY0 = autoy;
    }
    lastPixValue0 = pixValue0;

    hubbleAuto.update(autox, autoy); // update cursor
    hubbleAuto.show();
  }
}


function init() {
  for (i = 0; i < nNotes; i++) { // Load tunes
    note = loadSound('./sounds/Tunes/' + (i + 1) + 't.mp3');
    notesTunes.push(note);
  }
  for (i = 0; i < nNotes; i++) { // Load Chords
    note = loadSound('./sounds/Chords/' + (i + 1) + 'c.mp3');
    notesChords.push(note);
  }
 for (i = 0; i < nNotes; i++) { // Load Lux
    note = loadSound('./sounds/Lux/' + (i + 1) + 'l.mp3');
    notesLux.push(note);
    }

  makeTunes();
  makeManual();
}

function touchStarted() {
  if (mode == "automatic") {
    if (mouseX >= 0 && mouseX <= imWidth / imScale && mouseY >= 0 && mouseY <= imHeight / imScale) {
      autox = mouseX;
      autoy = mouseY;
      autox0 = mouseX;
      autoy0 = mouseY;
      startCorner(mouseX, mouseY);
    }
  }
  touchIsDown = true;
  if (getAudioContext().state !== 'running') {
  getAudioContext().resume();
}
}

function touchEnded() {
  touchIsDown = false;
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= imWidth / imScale && mouseY >= 0 && mouseY <= imHeight / imScale) {
    autox = mouseX;
    autoy = mouseY;
    autox0 = mouseX;
    autoy0 = mouseY;
    startCorner(mouseX, mouseY);
    signX = 1;
    signY = 0;
  }

  if (getAudioContext().state !== 'running') {
  getAudioContext().resume();
}
}

function playNotes() {
  for (i = 0; i < nNotes; i++) {
    if ((minValue + i * step) < pixValue && pixValue <= (minValue + (i + 1) * step)) {
      if (harmony == 'tunes') {
        notesTunes[i].play();
      }
      else if (harmony == 'chords') {
        notesChords[i].play();
      }
      else if (harmony == 'lux') {
        notesLux[i].play();
      }
      break;
    }
  }
}

function calcPixValue(coordX, coordY) {
  pixNum0 = Math.round(coordX * imScale) + Math.round(coordY * imScale) * imWidth;
  pixNum = Math.round(4 * pixNum0); //labels pixel
  pixValue = (activeImg.pixels[pixNum] + activeImg.pixels[pixNum + 1] + activeImg.pixels[pixNum + 2]) / 3.0;

  // Keep line below commented to have linear scaling
  //pixValue = Math.pow(pixValue / 256, 1.5) * 256; //scale brightness

  return pixValue;
}


function checkBounce() {
  if (autox >= imWidth / imScale || autox < 0) {
    speedSign *= -1;
  }
  else if (autoy >= imHeight / imScale || autoy < 0) {
    speedSign *= -1;
  }
}

// function startCorner(x, y) {
//   if (x < Math.round((imWidth/imScale)/2)) {
//     startX = x;
//   } else {
//     startX = imWidth/imScale - x;
//   }
//
//   if (y < Math.round((imHeight/imScale)/2)) {
//     startY = y;
//   } else {
//     startY = imHeight/imScale - y;
//   }
//
//   autox = startX;
//   autoy = startY;
// }

function checkCorner() {
  if (autox > imWidth/imScale - startX) {
    signX = 0;
    autox += -1;
    signY = 1;
  } else if (autox < startX) {
    signX = 0;
    autox += 1;
    signY = -1;
  } else if (autoy < startY) {
    signY = 0;
    autoy += 1;
    signX = 1;
  } else if (autoy > (imHeight/imScale - startY)) {
    signY = 0;
    autoy += -1;
    signX = -1;
  };
}

function moveRect() {
  autox += signX * speed;
  autoy += signY * speed;
  checkCorner(); // check for bouncing off walls
}


function faster() {
  speed *= 2.0;
  speed = Math.min(speed, maxSpeed);
}

function slower() {
  speed *= 0.5;
  speed = Math.max(speed, minSpeed);
}


function makeAutomatic() {
  mode = 'automatic';

  document.getElementById('autogrey_button').classList.add("hidden");
  document.getElementById('auto_button').classList.remove("hidden");
  document.getElementById('manualgrey_button').classList.remove("hidden");
  document.getElementById('manual_button').classList.add("hidden");

  document.getElementById('slower_button').classList.remove("hidden");
  document.getElementById('faster_button').classList.remove("hidden");
}

function makeManual() {
  mode = 'manual';

  document.getElementById('manualgrey_button').classList.add("hidden");
  document.getElementById('manual_button').classList.remove("hidden");
  document.getElementById('autogrey_button').classList.remove("hidden");
  document.getElementById('auto_button').classList.add("hidden");

  document.getElementById('slower_button').classList.add("hidden");
  document.getElementById('faster_button').classList.add("hidden");
}

function makeChords() {
  harmony = 'chords';

  document.getElementById('chords_g_button').classList.add("hidden");
  document.getElementById('chords_button').classList.remove("hidden");
  document.getElementById('tunes_g_button').classList.remove("hidden");
  document.getElementById('tunes_button').classList.add("hidden");
  document.getElementById('lux_g_button').classList.remove("hidden");
  document.getElementById('lux_button').classList.add("hidden");
}

function makeTunes() {
  harmony = 'tunes';

  document.getElementById('tunes_g_button').classList.add("hidden");
  document.getElementById('tunes_button').classList.remove("hidden");
  document.getElementById('chords_g_button').classList.remove("hidden");
  document.getElementById('chords_button').classList.add("hidden");
  document.getElementById('lux_g_button').classList.remove("hidden");
  document.getElementById('lux_button').classList.add("hidden");
}
function makeLux() {
    harmony = 'lux';

    document.getElementById('lux_g_button').classList.add("hidden");
    document.getElementById('lux_button').classList.remove("hidden");
    document.getElementById('chords_g_button').classList.remove("hidden");
    document.getElementById('chords_button').classList.add("hidden");
    document.getElementById('tunes_g_button').classList.remove("hidden");
    document.getElementById('tunes_button').classList.add("hidden");
}

// cursor object for automatic mode

function autoCursor(x, y) {
  this.x = x;
  this.y = y;

  this.update = function() {
    this.x = autox;
    this.y = autoy;
  };
  var imScale = 0.6;
  this.show = function() {
    image(hubbleImg, this.x - imScale * hubbleImg.width * 0.5, this.y - imScale * hubbleImg.height * 0.75, imScale * hubbleImg.width, imScale * hubbleImg.height);

  };
}

// cursor object for manual mode

function cursorIm(x, y) {
  this.x = x;
  this.y = y;

  this.update = function() {
    this.x = mouseX;
    this.y = mouseY;
  };

  this.show = function() {
    var imScale = 0.6;
    image(hubbleImg, this.x - imScale * hubbleImg.width * 0.5, this.y - imScale * hubbleImg.height * 0.75, imScale * hubbleImg.width, imScale * hubbleImg.height);

  };
}
