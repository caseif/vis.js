var frustumPadding = 50; // the units to pad the frustum by

function isInView(particle) {
    var translated = new THREE.Vector3();
    var size = particle.bokeh ? bokehMaterial.size : (particle.fleck ? fleckMaterial.size : pMaterial.size);
    translated.x = particle.x;
    translated.y = particle.y;
    translated.z = particle.z - camera.position.z;
    if (translated.x < 0) {
        translated.x += frustumPadding;
    } else {
        translated.x -= frustumPadding;
    }
    if (translated.y < 0) {
        translated.y += frustumPadding;
    } else {
        translated.y -= frustumPadding;
    }
    return frustum.containsPoint(translated);
}

function resetParticle(particle) {
    var rand = Math.random();
    var side;
    if (rand < leftChance) {
        side = 0;
    } else if (rand < leftChance + rightChance) {
        side = 2;
    } else if (rand < leftChance + rightChance + topBottomChance / 2) {
        side = 1;
    } else {
        side = 3;
    }
    
    var pos = getValidSpawnPosition(side, particle.bokeh, particle.fleck);
    particle.x = pos.x;
    particle.y = pos.y;
    particle.z = pos.z;

    var yRange = particle.bokeh ? bokehYVelRange : (particle.fleck ? fleckYVelScalar : yVelRange);
    var velVector = new THREE.Vector3((side != 0 ? 0.5 : 1) *
        particle.bokeh
                ? Math.random() * (bokehMaxVelocity - bokehMinVelocity) + bokehMinVelocity
                : (particle.fleck
                        ? fleckVelocity
                        : Math.random() * (maxParticleVelocity - minParticleVelocity) + minParticleVelocity),
        centerBiasedRandom(yRange, velBias),
        0
    );
    velVector = velVector.multiply(new THREE.Vector3(velocityResScale, velocityResScale, velocityResScale));
    if (side == 0) {
        particle.velocity = velVector;
    } else if (side == 2) {
        particle.velocity = velVector.multiply(new THREE.Vector3(-1, 1, 1));
    } else if (side == 1) {
        particle.velocity = new THREE.Vector3(velVector.y, velVector.x, velVector.z);
    } else if (side == 3) {
        particle.velocity = new THREE.Vector3(velVector.y, -velVector.x, velVector.z);
    }
}

/**
 * Returns a random valid spawn position for a particle.
 *
 * @param side The side of the screen to generate the position on (left=0,
 *             top=1, right=2, bottom=3)
 * @param bokeh Whether the particle is a bokeh
 * @param fleck Whether the particle is a fleck
 * @return The generated spawn position
 */
function getValidSpawnPosition(side, bokeh, fleck) {
    var z = bokeh ? bokehZ : (fleck ? fleckZ : biasedRandom(zPosRange, zPosBias) + zModifier); // random z-value
    if (side == 0 || fleck) { // left
        var x = -getXRangeAtZ(z) / 2; // x-value intersecting the frustum at this z-value
        var yRange = getYRangeAtZ(z); // maximum range on the y-axis at this z-value
        var y = bokeh ? Math.random() * yRange - yRange / 2 : centerBiasedRandom(yRange, xPosBias); // random y-value within calculated range
    } else if (side == 2) { // right
        var x = getXRangeAtZ(z) / 2;
        var yRange = getYRangeAtZ(z);
        var y = bokeh ? Math.random() * yRange - yRange / 2 : centerBiasedRandom(yRange, xPosBias); // random y-value within calculated range
    } else if (side == 1) { // top
        var y = -getYRangeAtZ(z) / 2;
        var xRange = getXRangeAtZ(z);
        var x = Math.random() * xRange - xRange / 2;
    } else { // bottom
        var y = getYRangeAtZ(z) / 2;
        var xRange = getXRangeAtZ(z);
        var x = Math.random() * xRange - xRange / 2;
    }
    return new THREE.Vector3(x, y, z);
}

function getXRangeAtZ(z) {
    return Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE)) * 2;
}

function getYRangeAtZ(z) {
    return Math.abs(camera.position.z - z) * Math.tan(toRads(VIEW_ANGLE / ASPECT)) * 2
}

function updateParticles() {
    particleSystem.material.size = particleSize;
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
