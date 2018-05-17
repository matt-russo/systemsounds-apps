
$(document).keypress(function(e) {
  // console.log(e.which);
  if(e.which == 32) {
    if (isPlaying==false){
      turnOn();
    }
    else {
      reset();
    }
  }
  // console.log(e.which);

  if(e.which == 105) {
    toggleMoon(0);
  }
  if(e.which == 101) {
    toggleMoon(1);
  }
  if(e.which == 103) {
    toggleMoon(2);
  }
  if(e.which == 99) {
    toggleMoon(3);
  }
  if(e.which == 115) {
    bpm*=6./7;
    bpm=Math.max(bpm,BASE_BPM);
    var value = Math.log(bpm/BASE_BPM)/Math.log(2);
    showValue(value, 1, false);
    document.getElementById('slider1').value = value;
  }
  if(e.which == 102) {
    bpm*=7./6;
    bpm=Math.min(bpm,bpmMax);
    var value = Math.log(bpm/BASE_BPM)/Math.log(2);
    showValue(value, 1, false);
    document.getElementById('slider1').value = value;
  }

});
