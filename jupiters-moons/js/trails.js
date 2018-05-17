//Make Trails, should use arcs instead since this leaves segments
const twoPI = Math.PI * 2;

var moons = [io,europa,ganymede,callisto];
var moonMeshes= [ioMesh,europaMesh,ganymedeMesh,callistoMesh];

var allTrails = [];
function makeTrails() {
  var inc = twoPI / 64.0;   //increment
  for ( j =0; j<4; j+=1) {
    circlePoints = [];
    var index = 0;
    // var scale = 0.7 ; //set to planet sizes
    var scale = moons[j].size;
    // console.log(scale);

    for ( var i = 0; i <= twoPI + inc; i+= inc )  {
        var vector = new THREE.Vector3();
        vector.set( Math.cos( i ) * scale, Math.sin( i ) * scale, 0 );
        circlePoints[ index ] = vector;
        index ++;
    }

    trailHeadGeometry = circlePoints;
    // create the trail renderer object
    var trail = new THREE.TrailRenderer( scene, false );
    var trailOpacity=0.7;
    // create material for the trail renderer
    var trailMaterial = THREE.TrailRenderer.createBaseMaterial();
    if (j==0) {trailMaterial.uniforms.headColor.value.set( 1,.83,.52, trailOpacity ); } //RGB normalized
    if (j==1) {trailMaterial.uniforms.headColor.value.set( 0,1,.8, trailOpacity );    }
    if (j==2) {trailMaterial.uniforms.headColor.value.set( 0.6,.7,1, trailOpacity );    }
    if (j==3) {trailMaterial.uniforms.headColor.value.set( .9,.6,1, trailOpacity );    }
    // trailMaterial.uniforms.tailColor.value=trailMaterial.uniforms.headColor.value;
    trailMaterial.uniforms.tailColor.value.set( 0,0,0, 0 );

    // specify length of trail
    var trailLength = 15;
    // initialize the trail
    trail.initialize( trailMaterial, trailLength, false, 0, trailHeadGeometry, moonMeshes[j] );
    trail.activate();
    allTrails.push(trail);
  }
}
