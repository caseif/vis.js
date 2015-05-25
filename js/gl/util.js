function isInView(particle) {
	var translated = new THREE.Vector3();
	var size = particle.bokeh ? bokehMaterial.size : (particle.fleck ? fleckMaterial.size : pMaterial.size);
	translated.x = particle.x - camera.position.x - size / 2;
	translated.y = particle.y - camera.position.y + (particle.y < camera.position.y ? 1 : -1) * size / 2;
	translated.z = particle.z - camera.position.z;
    return frustum.containsPoint(translated);
}

function resetParticle(particle) {
	var pos = getValidSpawnPosition(particle.bokeh, particle.fleck);
	particle.x = pos.x;
	particle.y = pos.y;
	particle.z = pos.z;
	
	var yRange = particle.bokeh ? bokehYVelRange : (particle.fleck ? fleckYVelRange : yVelRange);
	particle.velocity = new THREE.Vector3(
		particle.bokeh ? bokehVelocity : (particle.fleck ? fleckVelocity : velocity),
		Math.random() * yRange - yRange / 2,
		0
	);
}

function getValidSpawnPosition(bokeh, fleck) {
	console.log(bokeh);
	var z = bokeh ? bokehZ : (fleck ? fleckZ : Math.random() * zPosRange - zPosRange / 2); // random z-value
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

	for (var i = 0; i < flecks.vertices.length; i++) {
		var particle = flecks.vertices[i];
		particle.x += particle.velocity.x * velMult;
		particle.y += particle.velocity.y * velMult;
		particle.z += particle.velocity.z * velMult;
		if (particle.x > 0 && !isInView(particle)) {
			resetParticle(particle);
		}
	}
	fleckSystem.geometry.__dirtyVertices = true;
	fleckSystem.geometry.verticesNeedUpdate = true;

	for (var i = 0; i < bokeh.vertices.length; i++) {
		var particle = bokeh.vertices[i];
		particle.x += particle.velocity.x * velMult;
		particle.y += particle.velocity.y * velMult;
		particle.z += particle.velocity.z * velMult;
		if (particle.x > 0 && !isInView(particle)) {
			resetParticle(particle);
		}
	}
	bokehSystem.geometry.__dirtyVertices = true;
	bokehSystem.geometry.verticesNeedUpdate = true;
}

function toRads(degs) {
	return degs * Math.PI / 180;
}
