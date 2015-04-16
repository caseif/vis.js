var particleCount = 500;
var particles = new THREE.Geometry();
var pMaterial = new THREE.PointCloudMaterial({
  color: 0xFFFFFF,
  size: 5,
  map: THREE.ImageUtils.loadTexture(
    "./img/particle_alpha.png"
  ),
  blending: THREE.AdditiveBlending,
  transparent: true
});

var zPosRange = 400;
var yVelRange = 0.1;
var yVelBias = 0.02;
var zVelRange = 0.04;
var zVelBias = 0.02;

for (var p = 0; p < particleCount; p++) {

  var pX = Math.random() * 300 - 150,
      pY = Math.random() * 400 - 250,
      pZ = Math.random() * zPosRange - zPosRange / 2,
      particle = new THREE.Vector3(pX, pY, pZ);
	  
	  // create a velocity vector
particle.velocity = new THREE.Vector3(
	0.1,
	Math.random() * yVelRange - yVelRange / 2 - yVelBias,
	Math.random() * zVelRange - zVelRange / 2 - zVelBias
);

  // add it to the geometry
  particles.vertices.push(particle);
}

// create the particle system
var particleSystem = new THREE.PointCloud(
    particles,
    pMaterial);

// also update the particle system to
// sort the particles which enables
// the behaviour we want
particleSystem.sortParticles = true;

particleSystem.geometry.dynamic = true;

// add it to the scene
scene.add(particleSystem);
