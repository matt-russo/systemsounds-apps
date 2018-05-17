/////////////////////////////////////////////////////////////////////////////
//Main script to set up animation and request rendering
/////////////////////////////////////////////////////////////////////////////

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

//Create a new perspective camera
var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(220, 120, 0);
var maxr2 = Math.pow(camera.position.x,2)+Math.pow(camera.position.y,2);

//Create the WebGL renderer and set its size to the full dimensions of the screen.
var renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true
});
renderer.autoClearColor = false;
renderer.setSize(window.innerWidth+20, window.innerHeight+20);
var aspect = window.innerHeight / window.innerWidth;


//Orbit Controls
var orbit = new THREE.OrbitControls(camera, renderer.domElement);
orbit.minDistance = 10;
orbit.maxDistance = 499;

//Add the renderer canvas to the DOM.
container = document.getElementById('canvas');
document.body.appendChild(container);
container.appendChild(renderer.domElement);

//Create a new ambient light
var light = new THREE.AmbientLight(0x202020)
scene.add(light)
//Create a new directional light
var light = new THREE.DirectionalLight(0xfdfcf0, 1)
light.position.set(0, 35, 350)
scene.add(light)

// Add objects initialized in object.js
scene.add(sun);
scene.add(sunMesh);
scene.add(jupiterMesh);
scene.add(ioMesh);
scene.add(europaMesh);
scene.add(ganymedeMesh);
scene.add(callistoMesh);
scene.add(starField);

// Add transit planes
scene.add(ioPlane);
scene.add(europaPlane);
scene.add(ganymedePlane);
scene.add(callistoPlane);
var transitScale = 15 * Math.PI / 180; //sets fade time for transit planes

makeTrails();



//Set position increments for automatic mode
var dx = -.07;
var dy = .02;
var dz = .02;

var bpm = BASE_BPM;
const bpmMax = BASE_BPM*Math.pow(2,28); //sets highest note in Hz*60
// const bpmMax = 440 * 60; //sets highest note in Hz*60
const bpmMid = 10 * 60; //sets bpm where samples are suppressed


var bpmY = 300;
var bpmCross = 800; // only play notes, drums if bpm is less than this (too high and it can't catch up)
bpmScale = bpmCross - bpmY;


var volMin = -40;
var volMax = -18.0;
var oscScale = 10; //suppression scale for oscillator high pass
var oscY = 20; //suppress oscillator below this many Hz
makeOsc([io, europa, ganymede, callisto]);

var on = false; //master on to trigger tones
var isPlaying = false;
var mode = 'manual';
// var mode = 'automatic';
var direction=1.; //for automatic mode

var moon_arr = [io, europa, ganymede, callisto];
var mesh_arr = [ioMesh, europaMesh, ganymedeMesh, callistoMesh];
var plane_arr = [ioPlane, europaPlane, ganymedePlane, callistoPlane];
// drumsOn(moon_arr);


/////////////////////////////////////////////////////////////////////////////
var render = function(actions) {
  //Point the camera towards the jupiter
  camera.lookAt(jupiterVec);

  updateJupiter(bpm)
  if (!io.notebuffer) io.notebuffer = ioNote_BUFFER;
  if (!io.drumbuffer) io.drumbuffer = ioDrum_BUFFER;
  updateMoon(io, ioMesh);
  if (!europa.notebuffer) europa.notebuffer = europaNote_BUFFER;
  if (!europa.drumbuffer) europa.drumbuffer = europaDrum_BUFFER;
  updateMoon(europa, europaMesh);
  if (!ganymede.notebuffer) ganymede.notebuffer = ganymedeNote_BUFFER;
  if (!ganymede.drumbuffer) ganymede.drumbuffer = ganymedeDrum_BUFFER;
  updateMoon(ganymede, ganymedeMesh);;
  if (!callisto.notebuffer) callisto.notebuffer = callistoNote_BUFFER;
  if (!callisto.drumbuffer) callisto.drumbuffer = callistoDrum_BUFFER;
  updateMoon(callisto, callistoMesh);

  updateOsc([io, europa, ganymede, callisto]);


  //update plane opacity
  var bpmFade = Math.min(1., Math.exp(-bpm * 2 / bpmMid));
  ioPlane.material.opacity = Math.exp(-(2 * Math.PI - io.theta) / transitScale) * bpmFade;
  europaPlane.material.opacity = Math.exp(-(2 * Math.PI - europa.theta) / transitScale) * bpmFade;
  ganymedePlane.material.opacity = Math.exp(-(2 * Math.PI - ganymede.theta) / transitScale) * bpmFade;
  callistoPlane.material.opacity = Math.exp(-(2 * Math.PI - callisto.theta) / transitScale) * bpmFade;


  //advance trails
  for (j = 0; j < moon_arr.length; j++) {
    if (moon_arr[j].show == true) {
      allTrails[j].advance();
    }
  }

  if (mode == 'automatic') {

    bpm += direction*0.05 * bpm / 30; //exponential growth/decay
		if (direction>0) {
			bpm = Math.min(bpm, bpmMax);
		}
		if (direction<0) {
			bpm = Math.max(bpm, BASE_BPM);
		}
    var value = Math.log(bpm/BASE_BPM)/Math.log(2);
    showValue(value, 1, false);

    camera.position.y += direction*2 / camera.position.y;
    camera.position.x += direction*dx;
    camera.position.z += direction*dz;

		var camr2=Math.pow(camera.position.x,2)+Math.pow(camera.position.y,2)+Math.pow(camera.position.z,2);
		if (camr2>= maxr2*1.25 ) {
			direction*=-1;
		}
  }

  updateSpeed([jupiter, io, europa, ganymede, callisto], bpm);
  updateGauges();

  var val = document.getElementById("slider1").value;
	showValue(val,1,false); //update, resize slider

  renderer.render(scene, camera);
  requestAnimationFrame(render);
};
