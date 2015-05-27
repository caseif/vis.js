var particleCount = 1000; // total normal particle count
var fleckCount = particleCount * 0.05; // total fleck count
var bokehCount = particleCount * 0.25; // total bokeh count

var particles = new THREE.Geometry();
var flecks = new THREE.Geometry();
var bokeh = new THREE.Geometry();

var uniforms = {
	color: {type: "c", value: new THREE.Color(0xFFFFFF)},
};

var texture = THREE.ImageUtils.loadTexture(
	'./img/particle_alpha.png'
)
texture.minFilter = THREE.LinearFilter;

var bokehTexture = THREE.ImageUtils.loadTexture(
	'./img/bokeh.png'
)
bokehTexture.minFilter = THREE.LinearFilter;

var particleOpacity = 0.65;
var bokehOpacity = 0.6;

var pMaterial = new THREE.PointCloudMaterial({
	color: 0xFFFFFF,
	opacity: particleOpacity,
	size: 5,
	map: texture,
	blending: THREE.AdditiveBlending,
	transparent: true
});

var fleckMaterial = new THREE.PointCloudMaterial({
	color: color,
	opacity: particleOpacity,
	size: 2,
	map: texture,
	blending: THREE.AdditiveBlending,
	transparent: true
});

var bokehMaterial = new THREE.PointCloudMaterial({
	color: darken(brighten(color, 1.2), 1.2), // normalize it a little
	opacity: bokehOpacity,
	size: 150,
	map: bokehTexture,
	blending: THREE.AdditiveBlending,
	transparent: true
});

var velocity = 2.5;

var zPosRange = 350;

var yVelRange = velocity * 2;

for (var p = 0; p < particleCount; p++) {
	var z = Math.random() * zPosRange - (zPosRange / 2) - 50;
	var xRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE)) * 2; // maximum range on the x-axis at this z-value
	var yRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE / ASPECT)) * 2; // maximum range on the y-axis at this z-value
	var pX = Math.random() * xRange - xRange / 2,
		pY = Math.random() * yRange - yRange / 2,
		pZ = z,
		particle = new THREE.Vector3(pX, pY, pZ);
	  
	  // create a velocity vector
	particle.velocity = new THREE.Vector3(
		velocity,
		Math.random() * yVelRange - yVelRange / 2,
		0
	);

	// add it to the geometry
	particles.vertices.push(particle);
}

var fleckVelocity = velocity * 1.5;

var fleckYVelRange = fleckVelocity * 0.75;

var fleckZ = 150;

for (var p = 0; p < fleckCount; p++) {
	var z = fleckZ;
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
		Math.random() * fleckYVelRange - fleckYVelRange / 2,
		0
	);

	// add it to the geometry
	flecks.vertices.push(fleck);
}

var bokehVelocity = velocity;

var bokehYVelRange = bokehVelocity * 2;

var bokehZ = 150;

for (var p = 0; p < bokehCount; p++) {
	var z = bokehZ;
	var xRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE)) * 2; // maximum range on the x-axis at this z-value
	var yRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE / ASPECT)) * 2; // maximum range on the y-axis at this z-value
	var pX = Math.random() * xRange - xRange / 2,
		pY = Math.random() * yRange - yRange / 2,
		pZ = z,
		b = new THREE.Vector3(pX, pY, pZ);
	b.bokeh = true;
	  
	  // create a velocity vector
	b.velocity = new THREE.Vector3(
		bokehVelocity,
		Math.random() * bokehYVelRange - bokehYVelRange / 2,
		0
	);

	// add it to the geometry
	bokeh.vertices.push(b);
}

// create the particle systems
var particleSystem = new THREE.PointCloud(particles, pMaterial);
var fleckSystem = new THREE.PointCloud(flecks, fleckMaterial);
var bokehSystem = new THREE.PointCloud(bokeh, bokehMaterial);

// also update the particle system to
// sort the particles which enables
// the behaviour we want
particleSystem.sortParticles = true;
particleSystem.geometry.dynamic = true;

fleckSystem.sortParticles = true;
fleckSystem.geometry.dynamic = true;

bokehSystem.sortParticles = true;
bokehSystem.geometry.dynamic = true;

// add it to the scene
scene.add(bokehSystem);
scene.add(particleSystem);
scene.add(fleckSystem);
