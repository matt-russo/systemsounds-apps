/* Original code by Steven Estrella. http://www.shearspiremedia.com */
function showValue(val,slidernum,vertical) {
	/* setup variables for the elements of our slider */
	var thumb = document.getElementById("sliderthumb" + slidernum);
	var shell = document.getElementById("slidershell" + slidernum);
	var track = document.getElementById("slidertrack" + slidernum);
	var fill = document.getElementById("sliderfill" + slidernum);
	var rangevalue = document.getElementById("slidervalue" + slidernum);
	var slider = document.getElementById("slider" + slidernum);


	var pc = val/(slider.max - slider.min); /* the percentage slider value */
	var thumbsize = 150; /* must match the thumb size in your css */
	var bigval = 450; /* widest or tallest value depending on orientation */
	var smallval = 150; /* narrowest or shortest value depending on orientation */
	var tracksize = bigval - thumbsize;
	var fillsize = 20;
	var filloffset = 64; /* shift to make track match thumb*/
	var bordersize = 2;
	var loc = vertical ? (1 - pc) * tracksize : pc * tracksize;
	var degrees = -360 * pc /1.;
	var rotation = "rotate(" + degrees + "deg)";

	var trackShift=64; /* shift appearance of track to match range of motion of thumb image */
  var trackScale=.72; /* scale size of visible track to match range of motion of thumb image */


	// var w = window.innerWidth;
	var vw = document.documentElement.clientWidth; //viewport width
	// console.log(vw);

	/* reduce slider size for smaller windows*/
	if (vw > 1099) {
		bigval = 500;
		tracksize = bigval - thumbsize;
		loc = vertical ? (1 - pc) * tracksize : pc * tracksize;
		smallval = 150;
		fillsize = 20;
		filloffset = 65;
		trackShift=62;
		trackScale=.75;
	}

	else if (vw > 799) {
		bigval = 400;
		tracksize = bigval - thumbsize;
		loc = vertical ? (1 - pc) * tracksize : pc * tracksize;
		smallval = 150;
		fillsize = 20;
		filloffset = 64;
		trackShift=64;
		trackScale=.69;
	}

	else if (vw > 599) {
		bigval = 350;
		tracksize = bigval - thumbsize;
		loc = vertical ? (1 - pc) * tracksize : pc * tracksize;
		smallval = 150;
		fillsize = 16;
		filloffset = 64;
		trackShift=64;
		trackScale=.65;
	}

	else {
		bigval = 350;
		tracksize = bigval - thumbsize;
		loc = vertical ? (1 - pc) * tracksize : pc * tracksize;
		smallval = 150;
		fillsize = 16;
		filloffset = 64;
		trackShift=64;
		trackScale=.65;
	}


	rangevalue.innerHTML = val;

	thumb.style.webkitTransform = rotation;
	thumb.style.MozTransform = rotation;
	thumb.style.msTransform = rotation;

	fill.style.opacity = pc + 0.2 > 1 ? 1 : pc + 0.2;

	rangevalue.style.top = (vertical ? loc : 0) + "px";
	rangevalue.style.left = (vertical ? 0 : loc) + "px";
	thumb.style.top =  (vertical ? loc : 0) + "px";
	thumb.style.left = (vertical ? 0 : loc) + "px";

	fill.style.top = (vertical ? loc + (thumbsize/2) +trackShift: filloffset + bordersize) + "px";
	fill.style.left = (vertical ? filloffset + bordersize : trackShift) + "px";

	fill.style.width = (vertical ? fillsize : loc + (thumbsize/2)*0 +13) + "px";  /*  NEED to do this for vertical*/
	fill.style.height = (vertical ? bigval - filloffset - fillsize - loc : fillsize) + "px";

	shell.style.height = (vertical ? bigval : smallval) + "px";
	shell.style.width = (vertical ? smallval : bigval) + "px";


	track.style.height = (vertical ? bigval*trackScale - 4 : fillsize) + "px"; /* adjust for border */
	track.style.width = (vertical ? fillsize : bigval*trackScale - 4) + "px"; /* adjust for border */


	track.style.left = (vertical ? filloffset + bordersize : trackShift) + "px";
	track.style.top = (vertical ? trackShift : filloffset + bordersize) + "px";
}
/* we often need a function to set the slider values on page load */
function setValue(val,num,vertical) {
	document.getElementById("slider"+num).value = val;
	showValue(val,num,vertical);
}

document.addEventListener('DOMContentLoaded', function(){
  setValue(0,1,false);
})
