var imWidth = 1959, imHeight = 1000; // hard coded image dimensions
var cnv; // canvas
var imScale; // used to adjust canvas size based on window size

var nNotes = 15; // number of note steps   */
var minValue = 30; // minimum pixel value to count as a note
var step = (256. - minValue) / nNotes; // pixel value step size
var pixNum = 0, pixNum0 = 0, lastPixNum = 0, lastPixNum0 = 0;

var mode, harmony;
var notesMajor = [];
var notesMinor = [];

var autox0 = 0, autoy0 = 0, autox = 0, autoy = 0; // initialize mouse positions */

var speed = .1;
var maxSpeed = 26; // doublings of 0.1 gets to 25.6
var minSpeed = 0.01; // halvings of 0.1 gets to .0125
var speedSign = 1;   // initial direction (positive is downwards)

var cassini, cassiniAuto;

var touchIsDown = false;

// preload background and cursor images
function preload() {
  img = loadImage("./images/BRing.jpg");
  img2 = loadImage("./images/BRing2.jpg");
  cassiniImg = loadImage("./images/cassini.png");
  soundFormats('mp3');

}

// set up canvas, background image, and cursors
function setup() {
  cnv = createCanvas(imWidth, imHeight);
  cnv.parent('canvas');
  cnv.id('cassinicanvas');

  background(0);
  img.loadPixels();
  image(img, 0, 0);

  cassini = new cursorIm(0, 0);
  cassiniAuto = new autoCursor(0, 0);

  init(); // load all sound files and set initial mode and harmony
}



function draw() {
  background(0);
  cnv.size(windowWidth, windowHeight);
  imScale = imWidth / windowWidth;

  document.getElementById('buttonbar').setAttribute("style", "width:100%");

  if (harmony == 'major') {
    image(img, 0, 0, imWidth / imScale, imHeight / imScale);
  }
  if (harmony == 'minor') {
    image(img2, 0, 0, imWidth / imScale, imHeight / imScale);
  }

  if (mode == 'manual') {
    if (mouseIsPressed || touchIsDown) {

      // find current pixel number and pixel value
      pixNum = 4 * (Math.round(mouseX * imScale) + Math.round(mouseY * imScale) * imWidth); //labels pixel
      pixValue = (img.pixels[pixNum] + img.pixels[pixNum + 1] + img.pixels[pixNum + 2]) / 3.;
      pixValue = Math.pow(pixValue / 256, 1.5) * 256; //scale brightness

      if (pixNum != lastPixNum) {
        playNotes(); // trigger note for this pixel value
      }
      lastPixNum = pixNum;

      cassini.update(mouseX, mouseY); // update cursor postion
      cassini.show();
    }
  }

  if (mode == 'automatic') {

    autox += speedSign * speed;
    autoy = autoy0 + imHeight / imWidth * (autox - autox0);
    checkBounce(); // check for bouncing off walls

    // find current pixel number and pixel value
    pixNum0 = Math.round(autox * imScale) + Math.round(autoy * imScale) * imWidth;
    pixNum = Math.round(4 * pixNum0); //labels pixel
    pixValue = (img.pixels[pixNum] + img.pixels[pixNum + 1] + img.pixels[pixNum + 2]) / 3.;
    pixValue = Math.pow(pixValue / 256, 1.5) * 256; //scale brightness

    if (pixNum0 != lastPixNum0) {
      playNotes(); // trigger note for this pixel value
    }
    lastPixNum0 = pixNum0;

    cassiniAuto.update(autox, autoy); // update cursor
    cassiniAuto.show();
  }
}


function init() {
  for (i = 0; i < nNotes; i++) {
    note = loadSound('./sounds/Major/' + (i + 1) + 'M.mp3');
    notesMajor.push(note);
  }
  for (i = 0; i < nNotes; i++) {
    note = loadSound('./sounds/Minor/' + (i + 1) + 'm.mp3');
    notesMinor.push(note);
  }

  makeMajor();
  makeManual();
}

function touchStarted() {
  if (mode == "automatic") {
    if (mouseX >= 0 && mouseX <= imWidth / imScale && mouseY >= 0 && mouseY <= imHeight / imScale) {
      autox = mouseX;
      autoy = mouseY;
      autox0 = mouseX;
      autoy0 = mouseY;
    }
  }
  touchIsDown = true;
//   if (getAudioContext().state !== 'running') {
//   getAudioContext().resume();
// }
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
  }

//   if (getAudioContext().state !== 'running') {
//   getAudioContext().resume();
// }
}

function playNotes() {
  for (i = 0; i < nNotes; i++) {
    if ((minValue + i * step) < pixValue && pixValue <= (minValue + (i + 1) * step)) {
      if (harmony == 'major') {
        notesMajor[i].play();
      }
      if (harmony == 'minor') {
        notesMinor[i].play();
      }
      break;
    }
  }
}


function checkBounce() {
  if (autox >= imWidth / imScale || autox < 0) {
    speedSign *= -1
  }
  if (autoy >= imHeight / imScale || autoy < 0) {
    speedSign *= -1
  }
}


function faster() {
  speed *= 2.;
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

function makeMinor() {
  harmony = 'minor';

  document.getElementById('minorgrey_button').classList.add("hidden");
  document.getElementById('minor_button').classList.remove("hidden");
  document.getElementById('majorgrey_button').classList.remove("hidden");
  document.getElementById('major_button').classList.add("hidden");
}

function makeMajor() {
  harmony = 'major';

  document.getElementById('majorgrey_button').classList.add("hidden");
  document.getElementById('major_button').classList.remove("hidden");
  document.getElementById('minorgrey_button').classList.remove("hidden");
  document.getElementById('minor_button').classList.add("hidden");
}

// cursor object for automatic mode

function autoCursor(x, y) {
  this.x = x;
  this.y = y;

  this.update = function() {
    this.x = autox;
    this.y = autoy;
  }
  var imScale = .8;
  this.show = function() {
    image(cassiniImg, this.x - imScale * cassiniImg.width * 0.5, this.y - imScale * cassiniImg.height * 0.75, imScale * cassiniImg.width, imScale * cassiniImg.height);

  }
}

// cursor object for manual mode

function cursorIm(x, y) {
  this.x = x;
  this.y = y;

  this.update = function() {
    this.x = mouseX;
    this.y = mouseY;
  }

  this.show = function() {
    var imScale = .8;
    image(cassiniImg, this.x - imScale * cassiniImg.width * 0.5, this.y - imScale * cassiniImg.height * 0.75, imScale * cassiniImg.width, imScale * cassiniImg.height);

  }
}
