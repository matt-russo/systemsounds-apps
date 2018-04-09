//suppress default behavior for spacebar
window.addEventListener("keydown", function(e) {
  // space and arrow keys
  if ([32].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);

function keyPressed() {
  if (keyCode == 32 || keyCode == 90) {
    makeManual();
  }
  if (keyCode == 88) {
    makeAutomatic();
  }
  if (keyCode == 67) {
    slower();
  }
  if (keyCode == 86) {
    faster();
  }
  if (keyCode == 77) {
    makeMinor();
  }
  if (keyCode == 78) {
    makeMajor();
  }
}
