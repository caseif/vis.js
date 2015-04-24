var particleCount = 500; // total particle count including flecks
var fleckCount = particleCount * 0.075;
var particles = new THREE.Geometry();
var flecks = new THREE.Geometry();

var uniforms = {
	color: {type: "c", value: new THREE.Color(0xFFFFFF)},
};

var pMaterial = new THREE.PointCloudMaterial({
	color: 0xFFFFFF,
	size: 5,
	map: THREE.ImageUtils.loadTexture(
		'./img/particle_alpha.png'
	),
	blending: THREE.AdditiveBlending,
	transparent: true
});

var fleckMaterial = new THREE.PointCloudMaterial({
	color: color,
	size: 3,
	map: THREE.ImageUtils.loadTexture(
		'./img/particle_alpha.png'
	),
	blending: THREE.AdditiveBlending,
	transparent: true
});

var velocity = 0.1;

var zPosRange = 400;

var yVelRange = 0.1;

for (var p = 0; p < particleCount; p++) {
	var z = Math.random() * zPosRange - zPosRange / 2;
	var xRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE)) * 2; // maximum range on the x-axis at this z-value
	var yRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE / ASPECT)) * 2; // maximum range on the y-axis at this z-value
	var pX = Math.random() * xRange - xRange / 2,
		pY = Math.random() * yRange - yRange / 2,
		pZ = z,
		particle = new THREE.Vector3(pX, pY, pZ);
	  
	  // create a velocity vector
	particle.velocity = new THREE.Vector3(
		0.1,
		Math.random() * yVelRange - yVelRange / 2,
		0
	);

	// add it to the geometry
	particles.vertices.push(particle);
}

var fleckVelocity = 0.15;

var fleckZPosRange = 0;

var fleckYVelRange = 0.05;

for (var p = 0; p < fleckCount; p++) {
	var z = 0;
	var xRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE)) * 2; // maximum range on the x-axis at this z-value
	var yRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE / ASPECT)) * 2; // maximum range on the y-axis at this z-value
	var pX = Math.random() * xRange - xRange / 2,
		pY = Math.random() * yRange - yRange / 2,
		pZ = z,
		fleck = new THREE.Vector3(pX, pY, pZ);
	fleck.fleck = true;
	  
	  // create a velocity vector
	fleck.velocity = new THREE.Vector3(
		fleckVelocity,
		Math.random() * yVelRange - fleckYVelRange / 2,
		0
	);

	// add it to the geometry
	flecks.vertices.push(fleck);
}

// create the particle system
var particleSystem = new THREE.PointCloud(particles, pMaterial);
	
var fleckSystem = new THREE.PointCloud(flecks, fleckMaterial);

// also update the particle system to
// sort the particles which enables
// the behaviour we want
particleSystem.sortParticles = true;
particleSystem.geometry.dynamic = true;

fleckSystem.sortParticles = true;
fleckSystem.geometry.dynamic = true;

// add it to the scene
scene.add(particleSystem);
scene.add(fleckSystem);
