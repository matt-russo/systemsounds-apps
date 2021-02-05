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
var analyser;
var time_arr;
var bufferLoader;

var star_BUFFER = null;
var b_BUFFER = null;
var c_BUFFER = null;
var d_BUFFER = null;
var e_BUFFER = null;
var f_BUFFER = null;
var g_BUFFER = null;
var h_BUFFER = null;
var bcConj_BUFFER = null;
var cdConj_BUFFER = null;
var deConj_BUFFER = null;
var efConj_BUFFER = null;
var fgConj_BUFFER = null;
var ghConj_BUFFER = null;

// Create audio context and load sounds
window.AudioContext = window.AudioContext || window.webkitAudioContext;
audioContext = new AudioContext();

analyser = audioContext.createAnalyser();
analyser.fftSize = 1024;
time_arr = new Uint8Array(analyser.frequencyBinCount);

gain_melody = audioContext.createGain();
gain_melody.gain.value = 1;
gain_melody.connect(audioContext.destination);
gain_melody.connect(analyser);

gain_beat = audioContext.createGain();
gain_beat.gain.value = 0.4;
gain_beat.connect(audioContext.destination);
gain_beat.connect(analyser);

bufferLoader = new BufferLoader(
	audioContext,
	[
		'./sounds/tuned_TRAPPIST7.mp3',
		'./sounds/tuned_TRAPPIST6.mp3',
		'./sounds/tuned_TRAPPIST5.mp3',
		'./sounds/tuned_TRAPPIST4.mp3',
		'./sounds/tuned_TRAPPIST3.mp3',
		'./sounds/tuned_TRAPPIST2.mp3',
		'./sounds/tuned_TRAPPIST1.mp3',
		'./sounds/TRAPPISTstar.mp3',
		'./sounds/TRAPPISTdrums12.mp3',
		'./sounds/TRAPPISTdrums23.mp3',
		'./sounds/TRAPPISTdrums34.mp3',
		'./sounds/TRAPPISTdrums45.mp3',
		'./sounds/TRAPPISTdrums56.mp3',
		'./sounds/TRAPPISTdrums67.mp3',
	],
	function(bufferList) {
		h_BUFFER = bufferList[0];
		g_BUFFER = bufferList[1];
		f_BUFFER = bufferList[2];
		e_BUFFER = bufferList[3];
		d_BUFFER = bufferList[4];
		c_BUFFER = bufferList[5];
		b_BUFFER = bufferList[6];
		star_BUFFER = bufferList[7];
		bcConj_BUFFER = bufferList[8];
		cdConj_BUFFER = bufferList[9];
		deConj_BUFFER = bufferList[10];
		efConj_BUFFER = bufferList[11];
		fgConj_BUFFER = bufferList[12];
		ghConj_BUFFER = bufferList[13];
	});
bufferLoader.load();


function playSound(buffer, gainNode) {
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
