function drumsOn(moon_arr) {
  moon_arr.forEach(function(moon) {
    moon.playDrum = true;
  });
}

function drumsOff(moon_arr) {
  moon_arr.forEach(function(moon) {
    moon.playDrum = false;
  });
}


function soundOn(moon_arr) {
  moon_arr.forEach(function(moon) {
    moon.osc.start();
    moon.playDrum = true;
    moon.playNote = true;
  });
}

function soundOff(moon_arr) {
  moon_arr.forEach(function(moon) {
    moon.osc.stop();
    moon.playDrum = false;
    moon.playNote = false;
  });
}

function turnOn() {

  drumsOn([io,europa,ganymede,callisto]);
  if (on==false){
    render();
  }
  on=true;
  isPlaying=true;
  $('#playButton').fadeOut(1500);
  $('#blackOverlay').fadeOut(1500);
}

function makeManual() {
  mode = 'manual';
  bpm = BASE_BPM;
  t = 0;
  camera.position.set(220, 120, 0);
  document.getElementById('slider2').value = 0;

  updateBpm(0);
  direction=1;
  document.getElementById('slider2').classList.remove("hidden");
}
function makeAutomatic() {
  mode = 'automatic';
  bpm = BASE_BPM;
  camera.position.set(220, 120, 0);
  document.getElementById('slider2').value = 0;
  updateBpm(0);
  direction=1;
}

function reset() {
	bpm = BASE_BPM;
	t = 0;
	camera.position.set(220, 120, 0);
  document.getElementById('slider1').value = 0;
	updateBpm(0);
  showValue(0, 1, false);
	direction=1;
  $('#playButton').fadeIn(1500);
  $('#blackOverlay').fadeIn(1500);

  soundOff([io,europa,ganymede,callisto]);
  isPlaying=false;
}


function toggleMoon(moonNumber) {
    var moon=moon_arr[moonNumber];
    var moonM=mesh_arr[moonNumber];
    var moonP=plane_arr[moonNumber];
    moon.playDrum = !moon.playDrum;
    moonM.visible = !moonM.visible;
    moonP.visible = !moonP.visible;
    moon.show = !moon.show;
    if (moon.show==false){
      moon.osc.stop();
      allTrails[moonNumber].deactivate();
      moon.osc.mute = true; //not working
    }
    if (moon.show==true){
      // moon.osc.start();
      allTrails[moonNumber].activate()
      moon.osc.mute = false;
      moon.osc.start();
    }
    if (moonNumber==0) {
      document.getElementById('ioFreq').classList.toggle("hidden2");
      document.getElementById('ioGauge2').classList.toggle("hidden2");
      document.getElementById('ioButton').classList.toggle("hidden");
      document.getElementById('ioButtongrey').classList.toggle("hidden");
    }
    if (moonNumber==1) {
      document.getElementById('europaFreq').classList.toggle("hidden2");
      document.getElementById('europaGauge2').classList.toggle("hidden2"); //didn't work on this canvas??
      document.getElementById('europaButton').classList.toggle("hidden");
      document.getElementById('europaButtongrey').classList.toggle("hidden");
    }
    if (moonNumber==2) {
      document.getElementById('ganymedeFreq').classList.toggle("hidden2");
      document.getElementById('ganymedeGauge2').classList.toggle("hidden2"); //didn't work on this canvas??
      document.getElementById('ganymedeButton').classList.toggle("hidden");
      document.getElementById('ganymedeButtongrey').classList.toggle("hidden");
    }
    if (moonNumber==3) {
      document.getElementById('callistoFreq').classList.toggle("hidden2");
      document.getElementById('callistoGauge2').classList.toggle("hidden2"); //didn't work on this canvas??
      document.getElementById('callistoButton').classList.toggle("hidden");
      document.getElementById('callistoButtongrey').classList.toggle("hidden");
    }
}

$('#playButton').mouseover(function() {
  $(this).css('box-shadow','0px 0px 15px 15px rgba(229,153,255,0.5)').css('border-radius','100%').mouseleave(function() {
    $(this).css('box-shadow','0px 0px 0px 0px rgba(229,153,255,0.5)')
  });
});

// $('#resetButton').mouseover(function() {
//   $(this).css('box-shadow','0px 0px 6px 6px rgba(229,153,255,0.3)').css('border-radius','100%').mouseleave(function() {
//     $(this).css('box-shadow','0px 0px 0px 0px rgba(229,153,255,0.3)')
//   });
// });
