//////////////////////////////////////////////////
// visualizer.js - Waveform visualizer
// Uses the same `analyser` from audio.js

var visualizer = document.getElementById('visualizer');
var visContext = visualizer.getContext('2d');
var VIS_WIDTH = WIDTH;
var VIS_HEIGHT = 240;
visualizer.width = VIS_WIDTH;
visualizer.height = VIS_HEIGHT;

function drawVisualizer() {
	// Clear canvas by drawing clear (transparent) rectangle
	visContext.clearRect(0, 0, VIS_WIDTH, VIS_HEIGHT);

	// Interesting parameters to tweak!
	var SMOOTHING = 1;
	analyser.smoothingTimeConstant = SMOOTHING;

	// Get the frequency data from the currently playing music
	analyser.getByteTimeDomainData(time_arr);

	// Draw the time domain chart
	for (var i = 0; i < analyser.frequencyBinCount; i++) {
		var value = time_arr[i];
		var percent = Math.pow(value / 256,0.5);
		var height = VIS_HEIGHT * percent;
		var offset = VIS_HEIGHT - height - 1;
		var barWidth = VIS_WIDTH/analyser.frequencyBinCount;
		visContext.fillStyle = 'white';
		visContext.fillRect(i * barWidth, offset, 2, 1);
	}

	requestAnimationFrame(drawVisualizer.bind(this));
}

window.requestAnimationFrame(drawVisualizer);
