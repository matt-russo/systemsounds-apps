var imWidth = 1959, imHeight = 1000; // hard coded image dimensions
var cnv; // canvas
var imScale; // used to adjust canvas size based on window size

var nNotes = 14; // number of note steps   */
var minValue = 30; // minimum pixel value to count as a note
var step = (256. - minValue) / nNotes; // pixel value step size
var pixNum = 0, pixNum0 = 0, lastPixValue = 0, lastPixValue0 = 0;

var mode, harmony, update;
var notesMajor = [];
var notesMinor = [];

var autox0 = 0, autoy0 = 0, autox = 0, autoy = 0; // initialize mouse positions */

var speed = .1;
var maxSpeed = 26; // doublings of 0.1 gets to 25.6
var minSpeed = 0.01; // halvings of 0.1 gets to .0125
var speedSign = 1;   // initial direction (positive is downwards)

var hubble, hubbleAuto;

var touchIsDown = false;

// preload background and cursor images
function preload() {
  img = loadImage("./images/ngc6633_crop.jpg");
  img2 = loadImage("./images/BRing2.jpg");
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
  img.loadPixels();  // Loads image for sound to be played
  //img4.loadPixels(); // Uncomment for second image
  image(img, 0, 0);   // Sets starting display image

  hubble = new cursorIm(0, 0);
  hubbleAuto = new autoCursor(0, 0);

  init(); // load all sound files and set initial mode and harmony
}



function draw() {
  background(0);
  cnv.size(windowWidth, windowHeight);
  imScale = imWidth / windowWidth;

  document.getElementById('buttonbar').setAttribute("style", "width:100%");

  if (harmony == 'major' && update) {
    image(img, 0, 0, imWidth / imScale, imHeight / imScale);  // Sets displayed image
    activeImg = img;  // Sets image for sonification
    //update = false;
  }
  if (harmony == 'minor' && update) {
    image(img, 0, 0, imWidth / imScale, imHeight / imScale);  // Sets displayed image
    activeImg = img; // Sets image for sonification
    //update = false;
  }

  if (mode == 'manual') {
    if (mouseIsPressed || touchIsDown) {

      // find current pixel number and pixel value https://p5js.org/reference/#/p5/pixels
      // pixNum = 4 * (Math.round(mouseX * imScale) + Math.round(mouseY * imScale) * imWidth); //labels pixel
      // pixValue = (img3.pixels[pixNum] + img3.pixels[pixNum + 1] + img3.pixels[pixNum + 2]) / 3.;
      // pixValue = Math.pow(pixValue / 256, 1.5) * 256; //scale brightness
      pixValue = calcPixValue(mouseX, mouseY);

      if (pixValue != lastPixValue) {
        playNotes(); // trigger note for this pixel value
      }
      lastPixValue = pixValue;

      hubble.update(mouseX, mouseY); // update cursor postion
      hubble.show();
    }
  }

  if (mode == 'automatic') {

    autox += speedSign * speed;
    autoy = autoy0 + imHeight / imWidth * (autox - autox0);
    checkBounce(); // check for bouncing off walls

    // find current pixel number and pixel value
    // pixNum0 = Math.round(autox * imScale) + Math.round(autoy * imScale) * imWidth;
    // pixNum = Math.round(4 * pixNum0); //labels pixel
    // pixValue = (img.pixels[pixNum] + img.pixels[pixNum + 1] + img.pixels[pixNum + 2]) / 3.;
    // pixValue = Math.pow(pixValue / 256, 1.5) * 256; //scale brightness
    pixValue = calcPixValue(autox, autoy);

    if (pixValue0 != lastPixValue0) {
      playNotes(); // trigger note for this pixel value
    }
    lastPixValue0 = pixValue0;

    hubbleAuto.update(autox, autoy); // update cursor
    hubbleAuto.show();
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
  }

  if (getAudioContext().state !== 'running') {
  getAudioContext().resume();
}
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

function calcPixValue(coordX, coordY) {
  pixNum0 = Math.round(coordX * imScale) + Math.round(coordY * imScale) * imWidth;
  pixNum = Math.round(4 * pixNum0); //labels pixel
  pixValue = (activeImg.pixels[pixNum] + activeImg.pixels[pixNum + 1] + activeImg.pixels[pixNum + 2]) / 3.;

  // Keep line below commented to have linear scaling
  //pixValue = Math.pow(pixValue / 256, 1.5) * 256; //scale brightness

  return pixValue
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
  update = true;

  document.getElementById('minorgrey_button').classList.add("hidden");
  document.getElementById('minor_button').classList.remove("hidden");
  document.getElementById('majorgrey_button').classList.remove("hidden");
  document.getElementById('major_button').classList.add("hidden");

}

function makeMajor() {
  harmony = 'major';
  update = true;

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
  var imScale = .6;
  this.show = function() {
    image(hubbleImg, this.x - imScale * hubbleImg.width * 0.5, this.y - imScale * hubbleImg.height * 0.75, imScale * hubbleImg.width, imScale * hubbleImg.height);

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
    var imScale = .6;
    image(hubbleImg, this.x - imScale * hubbleImg.width * 0.5, this.y - imScale * hubbleImg.height * 0.75, imScale * hubbleImg.width, imScale * hubbleImg.height);

  }
}
