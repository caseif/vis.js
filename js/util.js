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
		biasedRandom(yRange, velBias),
		0
	);
}

function getValidSpawnPosition(bokeh, fleck) {
	var z = bokeh ? bokehZ : (fleck ? fleckZ : Math.random() * zPosRange - zPosRange / 2); // random z-value
	var x = -Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE)); // x-value intersecting the frustum at this z-value
	var yRange = Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE / ASPECT)) * 2; // maximum range on the y-axis at this z-value
	var y = bokeh ? Math.random() * yRange - yRange / 2 : biasedRandom(yRange, posBias); // random y-value within calculated range
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

function brighten(hexString, factor) {
	hexString = hexString.replace('#', '');
	var redHex = hexString.substring(0, 2);
	var greenHex = hexString.substring(2, 4);
	var blueHex = hexString.substring(4, 6);
	var newRed = Math.floor((parseInt('0x' + redHex) * (1 / factor) + 255 * ((factor - 1) / factor)));
	var newGreen = Math.floor((parseInt('0x' + greenHex) * (1 / factor) + 255 * ((factor - 1) / factor)));
	var newBlue = Math.floor((parseInt('0x' + blueHex) * (1 / factor) + 255 * ((factor - 1) / factor)));
	var newColor = '#'
			+ newRed.toString(16).toUpperCase()
			+ newGreen.toString(16).toUpperCase()
			+ newBlue.toString(16).toUpperCase();
	return newColor;
}

function darken(hexString, factor) {
	hexString = hexString.replace('#', '');
	var redHex = hexString.substring(0, 2);
	var greenHex = hexString.substring(2, 4);
	var blueHex = hexString.substring(4, 6);
	var newRed = Math.floor((parseInt('0x' + redHex) * (1 / factor)));
	var newGreen = Math.floor((parseInt('0x' + greenHex) * (1 / factor)));
	var newBlue = Math.floor((parseInt('0x' + blueHex) * (1 / factor)));
	var newColor = '#'
			+ newRed.toString(16).toUpperCase()
			+ newGreen.toString(16).toUpperCase()
			+ newBlue.toString(16).toUpperCase();
	return newColor;
}

function biasedRandom(range, bias) {
	return Math.floor((range / 2) - Math.pow(Math.random() * Math.pow(range / 2, bias), 1 / bias)) * (Math.random() >= 0.5 ? 1 : -1);
}

function selectiveToUpperCase(str) {
	str = str.toUpperCase();
	var i;
	while ((i = str.indexOf('^')) !== -1) {
		str = str.replace(str.substring(i, i + 2), str.substring(i + 1, i + 2).toLowerCase());
	}
	return str;
}
