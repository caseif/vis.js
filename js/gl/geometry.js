var particleCount = (($(document).width() * $(document).height()) / (1920 * 1080)) * baseParticleCount;
var fleckCount = particleCount * fleckCount; // total fleck count
var bokehCount = particleCount * bokehCount; // total bokeh count

//TODO: split main system into foreground and background particles
var particles = new THREE.Geometry();
var flecks = new THREE.Geometry();
var bokeh = new THREE.Geometry();

var stdTexure = THREE.ImageUtils.loadTexture(
	'./img/particle.png'
)
stdTexure.minFilter = THREE.LinearFilter;

var fleckTexture = THREE.ImageUtils.loadTexture(
	'./img/fleck.png'
)
fleckTexture.minFilter = THREE.LinearFilter;

var bokehTexture = THREE.ImageUtils.loadTexture(
	'./img/bokeh.png'
)
bokehTexture.minFilter = THREE.LinearFilter;

var pMaterial = new THREE.PointCloudMaterial({
	color: song.getGenre() === 'BTC' ? 0x000000 : 0xFFFFFF,
	opacity: particleOpacity,
	size: 5,
	map: stdTexure,
	blending: THREE.AdditiveBlending,
	transparent: true
});

var fleckMaterial = new THREE.PointCloudMaterial({
	color: color,
	opacity: particleOpacity,
	size: 4,
	map: fleckTexture,
	blending: THREE.AdditiveBlending,
	transparent: true
});

var bokehMaterial = new THREE.PointCloudMaterial({
	color: 0xFFFFFF,
	opacity: bokehOpacity,
	size: 100,
	map: bokehTexture,
	blending: THREE.AdditiveBlending,
	transparent: true
});

var velocity = particleVelocity * Math.pow(resRatio, 4);
var fleckVelocity = velocity * fleckVelocityScalar;

for (var p = 0; p < particleCount; p++) {
	var z = biasedRandom(zPosRange, zPosBias) + zModifier;
	var xRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE)) * 2; // maximum range on the x-axis at this z-value
	var yRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE / ASPECT)) * 2; // maximum range on the y-axis at this z-value
	var pX = Math.random() * xRange - xRange / 2,
		pY = centerBiasedRandom(yRange, xPosBias),
		pZ = z,
		particle = new THREE.Vector3(pX, pY, pZ);
	  
	  // create a velocity vector
	particle.velocity = new THREE.Vector3(
		velocity,
		centerBiasedRandom(yVelRange, velBias),
		0
	);

	// add it to the geometry
	particles.vertices.push(particle);
}

fleckYVelScalar *= fleckVelocity;

var fleckZ = 150;

for (var p = 0; p < fleckCount; p++) {
	var z = fleckZ;
	var xRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE)) * 2; // maximum range on the x-axis at this z-value
	var yRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE / ASPECT)) * 2; // maximum range on the y-axis at this z-value
	var pX = Math.random() * xRange - xRange / 2,
		pY = Math.floor(Math.random() * yRange) - yRange / 2,
		pZ = z,
		fleck = new THREE.Vector3(pX, pY, pZ);
	fleck.fleck = true;
	  
	  // create a velocity vector
	fleck.velocity = new THREE.Vector3(
		fleckVelocity,
		centerBiasedRandom(fleckYVelScalar, velBias),
		0
	);

	// add it to the geometry
	flecks.vertices.push(fleck);
}

var bokehMinVelocity = velocity * 0.25;
var bokehMaxVelocity = velocity * 0.5;

var bokehYVelRange = ((bokehMinVelocity + bokehMaxVelocity) * 0.5) * 2;

var bokehZ = 200;

for (var p = 0; p < bokehCount; p++) {
	var z = bokehZ;
    //var z = Math.random() * zPosRange - (zPosRange / 2);
	var xRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE)) * 2; // maximum range on the x-axis at this z-value
	var yRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE / ASPECT)) * 2; // maximum range on the y-axis at this z-value
	var pX = Math.random() * xRange - xRange / 2,
		pY = Math.random() * yRange - yRange / 2,
		pZ = z,
		b = new THREE.Vector3(pX, pY, pZ);
	b.bokeh = true;
	  
	  // create a velocity vector
	b.velocity = new THREE.Vector3(
		Math.random() * (bokehMaxVelocity - bokehMinVelocity) + bokehMinVelocity,
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

particleSystem.sortParticles = true;
particleSystem.geometry.dynamic = true;

fleckSystem.sortParticles = true;
fleckSystem.geometry.dynamic = true;

bokehSystem.sortParticles = true;
bokehSystem.geometry.dynamic = true;

// add it to the scene
scene.add(particleSystem);
if (song.getGenre() != 'BTC') {
	scene.add(fleckSystem);
	scene.add(bokehSystem);
}
