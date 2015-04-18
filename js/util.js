function isInView(particle) {
	var translated = new THREE.Vector3();
	translated.x = particle.x - camera.position.x;
	translated.y = particle.y - camera.position.y;
	translated.z = particle.z - camera.position.z;
    return frustum.containsPoint(translated);
}

function resetParticle(particle) {
	var pos = getValidSpawnPosition();
	particle.x = pos.x;
	particle.y = pos.y;
	particle.z = pos.z;
	
	particle.velocity = new THREE.Vector3(
		0.1,
		Math.random() * yVelRange - yVelRange / 2 - yVelBias,
		0
	);
}

function getValidSpawnPosition() {
	var z = Math.random() * zPosRange - zPosRange / 2; // random z-value
	var x = -Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE)); // x-value intersecting the frustum at this z-value
	var yRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE / ASPECT)) * 2; // maximum range on the y-axis at this z-value
	var y = Math.random() * yRange - yRange / 2; // random y-value within calculated range
	return new THREE.Vector3(x, y, z);
}

function updateParticles() {
	for (var i = 0; i < particles.vertices.length; i++) {
		var particle = particles.vertices[i];
		particle.x += particle.velocity.x * velMult;
		particle.y += particle.velocity.y * velMult;
		particle.z += particle.velocity.z * velMult;
		if (particle.x > 0 && !isInView(particle)) {
			resetParticle(particle);
		}
	}
	particleSystem.geometry.__dirtyVertices = true;
	particleSystem.geometry.verticesNeedUpdate = true;
}

function toRads(degs) {
	return degs * Math.PI / 180;
}
