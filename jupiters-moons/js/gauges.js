var ioOpts = {
  angle: 0.15, /// The span of the gauge arc
  lineWidth: 0.44, // The line thickness
  pointer: {
    length: 0.9, // Relative to gauge radius
    strokeWidth: 0.035, // The thickness
    color: 'rgba(255,212,132,1)', // Fill color
  },
  colorStart: 'rgba(255,212,132,1)',   // Colors
  colorStop: 'rgba(255,212,132,1)',    // just experiment with them
  strokeColor: 'rgba(255,212,132,.35)',   // to see which ones work best for you

};

var europaOpts = {
  angle: 0.15, /// The span of the gauge arc
  lineWidth: 0.44, // The line thickness
  pointer: {
    length: 0.9, // Relative to gauge radius
    strokeWidth: 0.035, // The thickness
    color: 'rgba(0, 255, 204,1)' // Fill color
  },
  colorStart: 'rgba(0, 255, 204,1)',   // Colors
  colorStop: 'rgba(0, 255, 204,1)',    // just experiment with them
  strokeColor: 'rgba(0, 255, 204,.35)'   // to see which ones work best for you
};

var ganymedeOpts = {
  angle: 0.15, /// The span of the gauge arc
  lineWidth: 0.44, // The line thickness
  pointer: {
    length: 0.9, // Relative to gauge radius
    strokeWidth: 0.035, // The thickness
    color: 'rgba(153,178,255,1)' // Fill color
  },
  colorStart: 'rgba(153,178,255,1)',   // Colors
  colorStop: 'rgba(153,178,255,1)',    // just experiment with them
  strokeColor: 'rgba(153,178,255,.35)'   // to see which ones work best for you
};

var callistoOpts = {
  angle: 0.15, /// The span of the gauge arc
  lineWidth: 0.44, // The line thickness
  pointer: {
    length: 0.9, // Relative to gauge radius
    strokeWidth: 0.035, // The thickness
    color: 'rgba(229,153,255,1)' // Fill color
  },
  colorStart: 'rgba(229,153,255,1)',   // Colors
  colorStop: 'rgba(229,153,255,1)',    // just experiment with them
  strokeColor: 'rgba(229,153,255,.35)'   // to see which ones work best for you
};

var ioFreq0 = 1./io.period_days/24/60/60;
var callistoFreq0 = 1./callisto.period_days/24/60/60;
var fMax=ioFreq0*Math.pow(2,28);
var fMin=callistoFreq0*Math.pow(2,15);
var vmin=Math.log(fMin/fMax)/Math.log(2);
// console.log(vmin);


var gauge1= document.getElementById('ioGauge2'); // your canvas element
var ioGauge2 = new Gauge(gauge1).setOptions(ioOpts); // create sexy gauge!
ioGauge2.maxValue = 0; // set max gauge value
ioGauge2.setMinValue(vmin);  // set min value
ioGauge2.set((Math.log((io.freq* 60./(Math.PI * 2))/fMax)/Math.log(2)).toFixed(2)); // set actual value


var gauge2= document.getElementById('europaGauge2'); // your canvas element
var europaGauge2 = new Gauge(gauge2).setOptions(europaOpts); // create sexy gauge!
europaGauge2.maxValue = 0; // set max gauge value
europaGauge2.setMinValue(vmin);  // set min value
europaGauge2.set((Math.log((europa.freq* 60./(Math.PI * 2))/fMax)/Math.log(2)).toFixed(2));

var gauge3 = document.getElementById('ganymedeGauge2'); // your canvas element
var ganymedeGauge2 = new Gauge(gauge3).setOptions(ganymedeOpts); // create sexy gauge!
ganymedeGauge2.maxValue = 0; // set max gauge value
ganymedeGauge2.setMinValue(vmin);  // set min value
ganymedeGauge2.set((Math.log((ganymede.freq* 60./(Math.PI * 2))/fMax)/Math.log(2)).toFixed(2));

var gauge4 = document.getElementById('callistoGauge2'); // your canvas element
var callistoGauge2 = new Gauge(gauge4).setOptions(callistoOpts); // create sexy gauge!
callistoGauge2.maxValue = 0; // set max gauge value
callistoGauge2.setMinValue(vmin);  // set min value
callistoGauge2.set((Math.log((callisto.freq* 60./(Math.PI * 2))/fMax)/Math.log(2)).toFixed(2));


function updateGauges() {

  var ioFreq=(io.freq* 60./(Math.PI * 2));
  var v=(Math.log(ioFreq/fMax)/Math.log(2)).toFixed(2);
  ioGauge2.set(v); // set actual value

  var europaFreq=(europa.freq* 60./(Math.PI * 2));
  var v=(Math.log(europaFreq/fMax)/Math.log(2)).toFixed(2);
  europaGauge2.set(v); // set actual value

  var ganymedeFreq=(ganymede.freq* 60./(Math.PI * 2));
  var v=(Math.log(ganymedeFreq/fMax)/Math.log(2)).toFixed(2);
  ganymedeGauge2.set(v); // set actual value

  var callistoFreq=(callisto.freq* 60./(Math.PI * 2));
  var v=(Math.log(callistoFreq/fMax)/Math.log(2)).toFixed(2);
  callistoGauge2.set(v); // set actual value
}
