// set the scene size
//var width = width == undefined ? 800 : width;
//var height = height == undefined ? 600 : height;
starWidth = $(document).width();
starHeight = $(document).height();

// set some camera attributes
var VIEW_ANGLE = 45,
  ASPECT = starWidth / starHeight,
  NEAR = 0.1,
  FAR = 10000;

// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer({alpha: true});
var params = {
    minFilter: THREE.LinearFilter, 
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false
};

var camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);

var scene = new THREE.Scene();

// add the camera to the scene
scene.add(camera);

// pull it back a bit
camera.position.z = 300;

// create the frustum
var frustum = new THREE.Frustum();
camera.updateMatrixWorld();
frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

// start the renderer
renderer.setSize(starWidth, starHeight);

// attach the render-supplied DOM element
renderer.domElement.id = 'particles';
$('.partsbg').append(renderer.domElement);
