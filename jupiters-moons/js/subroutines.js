function makeOsc(moon_arr) {
  moon_arr.forEach(function(moon) {
    moon.osc = new Tone.Oscillator().toMaster();
    StartAudioContext(moon.osc.context , "#playButton");

    moon.osc.type = "square";  //sine, triangle or square
    // moon.osc.type = "sine4";  //sine, triangle or square
    if (moon.osc.type=="square") {moon.osc.frequency.value = moon.freq * 60. / twoPI/2 ;}
    else {moon.osc.frequency.value = moon.freq * 60. / twoPI ;}

    moon.osc.volume.value = volMax * (2. - moon.relVolume); // in dB, adjust for each
  });
}

function oscOn(moon_arr) {
  moon_arr.forEach(function(moon) {
    moon.osc.start();
  });
}





function updateOsc(moon_arr) {

  moon_arr.forEach(function(moon) {

    moon.osc.frequency.value = moon.freq * 60 / twoPI; //in Hz
    var pow = 2;
    var vol = Math.pow(1 - 0.25*moon.osc.frequency.value / bpmMax * 60 * (ganymede.freq / io.freq), pow); //suppress higher frequencies
    vol *= Math.min(1,Math.exp((moon.osc.frequency.value - oscY)/oscScale)); //suppress oscillator below 20Hz

    moon.osc.volume.value = lerp(volMin, volMax, vol);

  });
}


function updateBpm(value) {
  bpm = BASE_BPM*Math.pow(2,value);
}

function updateSpeed(moon_arr, bpm) {
  moon_arr.forEach(function(moon) {
    moon.freq = (bpm / BASE_BPM) / moon.period;
    var moonbpm=moon.freq * 60. / twoPI*60;
    moon.bufferVol = Math.min(1., Math.exp(-moonbpm / bpmMid)); //suppress above certain bpm scale

  });

  document.getElementById("ioFreq").textContent = (io.freq* 60./twoPI).toFixed(2).toString() +' Hz';
  document.getElementById("europaFreq").textContent = (europa.freq* 60./twoPI).toFixed(2).toString() +' Hz';
  document.getElementById("ganymedeFreq").textContent = (ganymede.freq* 60./twoPI).toFixed(2).toString() +' Hz';
  document.getElementById("callistoFreq").textContent = (callisto.freq* 60./twoPI).toFixed(2).toString() +' Hz';
}


function updateJupiter(bpm) {
  jupiterMesh.rotation.y += jupiter.freq;   //update!!!!!!!!!!!!!!!!!!
  jupiter.freq = (bpm / BASE_BPM) / jupiter.period;
}

function updateMoon(moon, moonMesh) {

  moon.theta -= moon.freq;

  moonMesh.position.x = moon.distance * Math.cos(moon.theta);
  moonMesh.position.z = moon.distance * Math.sin(moon.theta);
  moonMesh.rotation.y = -moon.theta;


  if (moon.theta <= 0) {//if transit occurs  if (moon.theta <= 0)
    moon.theta += twoPI;
    if (moon.playDrum)  {
      if (moon.freq * 60./twoPI<30) {
      gain_beat.gain.value = moon.bufferVol;
      playSound(moon.drumbuffer, gain_beat);
      moon.osc.start();
      }
    }
  }
  moon.theta = moon.theta%twoPI;
  moon.thetalast=moon.theta;
}


window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
  var vw = document.documentElement.clientWidth; //viewport width
  var vh = document.documentElement.clientHeight; //viewport width
  // var w = window.innerWidth;
  // // camera.aspect = window.innerWidth / window.innerHeight;
  // // camera.updateProjectionMatrix();
  // renderer.setSize(w+20, w* aspect+20);

  // renderer.setSize(window.screen.width, window.screen.height);
  // camera.aspect = window.innerWidth / window.innerHeight;
  // renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  // camera.updateProjectionMatrix();


  renderer.setSize(vw, vh);
  camera.aspect = vw/vh;
  renderer.setViewport(0, 0, vw, vh);
  // camera.aspect = 1/aspect;
  camera.updateProjectionMatrix();
}


// linear extrapolate
function lerp(a, b, t) {
  return a + (b - a) * t;
}
