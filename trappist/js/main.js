//////////////////////////////////////////////////
// main.js - Where the action happens

//////////////////////////////////////////////////
// Canvas stuff
if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (function() {
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (/*function FrameRequestCallback*/ callback, /*DOMElement Element*/ element) {
			window.setTimeout(callback, 1000/60);
		};
	})();
}

// Canvas settings
var canvas = document.getElementById('scene');
var drawContext = canvas.getContext('2d');
const WIDTH = 1280;
const HEIGHT = 720;
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Draw black background in case background image takes a while to load
drawContext.fillStyle = 'rgba(0,0,0,1)';
drawContext.fillRect(0, 0, WIDTH, HEIGHT)

// Draw background image
var bgImg = new Image();
bgImg.src = 'images/background.png';
bgImg.onLoad = drawContext.drawImage(bgImg, 0, 0, WIDTH, HEIGHT);

// Set origin to centre
drawContext.translate(WIDTH/2, HEIGHT/2);

// Draw star image
var starImg = new Image();
const STAR_WIDTH = 160;
const STAR_HEIGHT = 160;
starImg.src = 'images/TRAPPIST_starRed.png';
starImg.onLoad = drawContext.drawImage(starImg, -STAR_WIDTH/2, -STAR_HEIGHT/2, STAR_WIDTH, STAR_HEIGHT);




//////////////////////////////////////////////////
// Draw stuff
function draw() {
	// Draw background image
	drawContext.globalAlpha = 0.1;
	drawContext.drawImage(bgImg, -WIDTH/2, -HEIGHT/2, WIDTH, HEIGHT);
	drawContext.globalAlpha = 1;

	// Draw star
	drawContext.save();
	star.theta += star.freq;
	drawContext.rotate(-star.theta);
	drawContext.drawImage(starImg, -STAR_WIDTH/2, -STAR_HEIGHT/2, STAR_WIDTH, STAR_HEIGHT);
	drawContext.restore();


	// Draw planet h
	if (!h.buffer) h.buffer = h_BUFFER;
	updatePlanet(h);

	// Draw planet g and check for conjunction with planet h
	if (!g.buffer) g.buffer = g_BUFFER;
	updatePlanet(g);
	if (!conj_gh.conjBuffer) conj_gh.conjBuffer = ghConj_BUFFER;
	checkConjunction(g, h, conj_gh);

	// Draw planet f and check for conjunction with planet g
	if (!f.buffer) f.buffer = f_BUFFER;
	updatePlanet(f);
	if (!conj_fg.conjBuffer) conj_fg.conjBuffer = fgConj_BUFFER;
	checkConjunction(f, g, conj_fg);

	// Draw planet e and check for conjunction with planet f
	if (!e.buffer) e.buffer = e_BUFFER;
	updatePlanet(e);
	if (!conj_ef.conjBuffer) conj_ef.conjBuffer = efConj_BUFFER;
	checkConjunction(e, f, conj_ef);

	// Draw planet d and check for conjunction with planet e
	if (!d.buffer) d.buffer = d_BUFFER;
	updatePlanet(d);
	if (!conj_de.conjBuffer) conj_de.conjBuffer = deConj_BUFFER;
	checkConjunction(d, e, conj_de);

	// Draw planet c and check for conjunction with planet d
	if (!c.buffer) c.buffer = c_BUFFER;
	updatePlanet(c);
	if (!conj_cd.conjBuffer) conj_cd.conjBuffer = cdConj_BUFFER;
	checkConjunction(c, d, conj_cd);

	// Draw planet b and check for conjunction with planet c
	if (!b.buffer) b.buffer = b_BUFFER;
	updatePlanet(b);
	if (!conj_bc.conjBuffer) conj_bc.conjBuffer = bcConj_BUFFER;
	checkConjunction(b, c, conj_bc);

	window.requestAnimationFrame(draw.bind(this));
}

window.requestAnimationFrame(draw);
