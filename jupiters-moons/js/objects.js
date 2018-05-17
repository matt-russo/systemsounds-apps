//Make Jupiter, Moons, transit planes, starfield, sun


const P_ganymede = 7.1546;  //period in days
const f_ganymede = 1/P_ganymede/24/60/60; //frequency in Hz
const BASE_BPM = f_ganymede*60*Math.pow(2,15);						// Use  as the basic unit fo Ganymede
const twoPi = Math.PI * 2;
///////////////////// JUPITER/////////////////////////////////////////////////
var jupiter = {theta: 0, period: 0.41/P_ganymede*(60*60/BASE_BPM/2./Math.PI), freq: 1.0/(0.41/P_ganymede*(60*60/BASE_BPM/2./Math.PI))};

//Create geometry and material
var jupiterGeometry = new THREE.SphereGeometry( 3, 50, 50 );
var jupiterMaterial = new THREE.MeshPhongMaterial({
  map: new THREE.TextureLoader().load( "images/jupiter_texture.jpg" ),
  color: 0xaaaaaa,
  specular: 0x333333,
  shininess: 0
});

var jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
//Vector pointing towards the jupiter
var jupiterVec = new THREE.Vector3(0, 0, 0);

///////////////////// MOONS /////////////////////////////////////////////////

const distance_scale=0.3;
const size_scale=1.;

class Moon {
	constructor(name, show, theta, period_days, size, distance, notebuffer, drumbuffer,relVolume) {
		this.name = name;
		this.show = show;					// display moon or not (boolean)  (NOT USING RIGHT NOW)
		this.theta = -theta;					// initial angle (radians)
		this.thetalast = -theta;					// last angle (radians)
		this.theta0 = -theta;         // initial angle (radians), not reset
		this.period_days=period_days
		this.freq = 1.0/(period_days/P_ganymede*(60*60/BASE_BPM/2./Math.PI));		// frequency of orbit (radians/cycle)
    this.period = period_days/P_ganymede*(60*60/BASE_BPM/2./Math.PI);				// period of orbit (cycles/radian), not updated during animation
    //this.freq = 1.0/period;		// frequency of orbit (radians/cycle)
		this.size = size*size_scale;					// size of moon (pixels)
		this.distance = distance*distance_scale;			// size of orbit (pixels)
		this.playNote = false;			// play the note on transit or not (boolean)
		this.playDrum = false;			// play the note on transit or not (boolean)
		this.notebuffer = notebuffer;				// note sound of the moon (audio buffer)
		this.drumbuffer = drumbuffer;				// drum sound of the moon (audio buffer)
    this.relVolume =relVolume;  //relative volume for tone
    this.bufferVol =1.;  //volume for note, drum buffers
	}
}

// Create moons (io, europa, ganymede, callisto)
var io = new Moon('io',true, 2.4129754, 1.76997, .7, 67, ioNote_BUFFER,ioDrum_BUFFER,0.9);
var europa = new Moon('europa',true, 0.0229487, 3.55379, 0.6, 107, europaNote_BUFFER,europaDrum_BUFFER,0.9);
var ganymede = new Moon('ganymede',true, -2.733736 +2*Math.PI,P_ganymede, 1, 170, ganymedeNote_BUFFER, ganymedeDrum_BUFFER,0.9);
var callisto = new Moon('callisto',true, 1.107091,16.68718, 0.9, 300, callistoNote_BUFFER,callistoDrum_BUFFER,1.);


//Make Io
var ioGeometry = new THREE.SphereGeometry(io.size, 50,50);
var ioMaterial = new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("images/io_texture.jpg")});
var ioMesh = new THREE.Mesh(ioGeometry, ioMaterial);
ioMesh.position.set(io.distance*Math.cos(io.theta),0,io.distance*Math.sin(io.theta));

//Make Europa
var europaGeometry = new THREE.SphereGeometry(europa.size, 50,50);
var europaMaterial = new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load("images/europa_texture.jpg")});
var europaMesh = new THREE.Mesh(europaGeometry, europaMaterial);
europaMesh.position.set(europa.distance*Math.cos(europa.theta),0,europa.distance*Math.sin(europa.theta));


//Make Ganymede
var ganymedeGeometry = new THREE.SphereGeometry(ganymede.size, 50,50);
var ganymedeMaterial = new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("images/ganymede_texture.jpg")});
var ganymedeMesh = new THREE.Mesh(ganymedeGeometry, ganymedeMaterial);
ganymedeMesh.position.set(ganymede.distance*Math.cos(ganymede.theta),0,ganymede.distance*Math.sin(ganymede.theta));

//Make Callisto
var callistoGeometry = new THREE.SphereGeometry(callisto.size, 50,50);
var callistoMaterial = new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load("images/callisto_texture.jpg")});
var callistoMesh = new THREE.Mesh(callistoGeometry, callistoMaterial);
callistoMesh.position.set(callisto.distance*Math.cos(callisto.theta),0,callisto.distance*Math.sin(callisto.theta));
// scene.add(callistoMesh);


// // transit plane
planeGeometry = new THREE.BoxGeometry( callisto.distance, 2,2);
ioPlaneMaterial =  new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, transparent: true, opacity: 0. ,color:0xFFD484} );
var ioPlane = new THREE.Mesh(planeGeometry,ioPlaneMaterial );
ioPlane.position.x = callisto.distance/2;

europaPlaneMaterial =  new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, transparent: true, opacity: 0. ,color:0x00ffcc} );
var europaPlane = new THREE.Mesh(planeGeometry,europaPlaneMaterial );
europaPlane.position.x = callisto.distance/2;

ganymedePlaneMaterial =  new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, transparent: true, opacity: 0. ,color:0x99B2FF} );
var ganymedePlane = new THREE.Mesh(planeGeometry,ganymedePlaneMaterial );
ganymedePlane.position.x = callisto.distance/2;

callistoPlaneMaterial =  new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, transparent: true, opacity: 0. ,color:0xE599FF} );
var callistoPlane = new THREE.Mesh(planeGeometry,callistoPlaneMaterial );
callistoPlane.position.x = callisto.distance/2;


///////////////////// STARFIELD /////////////////////////////////////////////////

//Starfield
var starGeometry = new THREE.SphereGeometry(500, 50, 50);
var starMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load("images/starfield.jpg"),
  side: THREE.DoubleSide,
  transparent: true,
  opacity: .5
});
var starField = new THREE.Mesh(starGeometry, starMaterial);
starField.rotation.x=60*Math.PI/180.;
starField.rotation.y=180*Math.PI/180.;


var spriteMap = new THREE.TextureLoader().load("images/sunflare.png");
var spriteMaterial = new THREE.SpriteMaterial({
  map: spriteMap,
  transparent: true,
  opacity: 0.9
});
var sun = new THREE.Sprite(spriteMaterial);
sun.position.set(0, 35, 350);
sun.scale.set(45, 45, 45);


var sunGeometry = new THREE.SphereGeometry( 3, 50, 50 );
var sunMaterial = new THREE.MeshBasicMaterial({color: 0xffffff,
});

var sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.position.set(0,35,350)
