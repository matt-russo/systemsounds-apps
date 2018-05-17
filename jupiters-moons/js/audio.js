//////////////////////////////////////////////////
// audio.js - Web audio stuff

// ----- buffer-loader.js
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
// ----- end buffer-loader.js

//////////////////////////////////////////////////
// Main section
var audioContext;
var gain_melody;
var gain_beat;
var bufferLoader;

var star_BUFFER = null;

var ioNote_BUFFER = null;
var europaNote_BUFFER = null;
var ganymedeNote_BUFFER = null;
var callistoNote_BUFFER = null;

var ioDrum_BUFFER = null;
var europaDrum_BUFFER = null;
var ganymedeDrum_BUFFER = null;
var callistoDrum_BUFFER = null;


// Create audio context and load sounds
window.AudioContext = window.AudioContext || window.webkitAudioContext;
audioContext = new AudioContext();
StartAudioContext(audioContext, "#playButton");

gain_melody = audioContext.createGain();
gain_melody.gain.value = 1;
gain_melody.connect(audioContext.destination);

gain_beat = audioContext.createGain();
gain_beat.gain.value = 1;
gain_beat.connect(audioContext.destination);

bufferLoader = new BufferLoader(
	audioContext,
	[
		'./sounds/io_note.mp3',
		'./sounds/europa_note.mp3',
		'./sounds/ganymede_note.mp3',
		'./sounds/callisto_note.mp3',
		'./sounds/io_drum.mp3',
		'./sounds/europa_drum.mp3',
		'./sounds/ganymede_drum.mp3',
		'./sounds/callisto_drum.mp3',
	],
	function(bufferList) {
		ioNote_BUFFER = bufferList[0];
		europaNote_BUFFER = bufferList[1];
		ganymedeNote_BUFFER = bufferList[2];
		callistoNote_BUFFER = bufferList[3];
		ioDrum_BUFFER = bufferList[4];
		europaDrum_BUFFER = bufferList[5];
		ganymedeDrum_BUFFER = bufferList[6];
		callistoDrum_BUFFER = bufferList[7];

	});
bufferLoader.load();


function playSound(buffer, gainNode) {   //now taking notebuffer or drumbuffer
	var source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(gainNode);
	source.start(0);
}

function updateGain(value, gainNode) {
	gainNode.gain.value = value;
}

function updateGainMeter(value, gainMeter) {
	document.getElementById(gainMeter).textContent = Math.round(value*100).toString();
}

document.body.addEventListener('touchend', activate);
function activate() {
    console.log('touchend event did fire');
    audioContext.resume();
    if (audioContext.state === 'running') {
        document.body.removeEventListener('touchend', activate);
    }
}
