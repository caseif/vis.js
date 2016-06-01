var lastProcess = Date.now();
var lastSpectrum = [];
var prevPeak = -1;

function initSpectrumHandler() {
    scriptProcessor.onaudioprocess = handleAudio;
}

function handleAudio() {
    // don't do anything if the audio is paused
    if (!isPlaying) {
        return;
    }

    var now = Date.now();
    do { now = Date.now(); } while (now - lastProcess < minProcessPeriod);
    lastProcess = Date.now();

    checkHideableText();

    var initialArray =  new Uint8Array(analyzer.frequencyBinCount);
    analyzer.getByteFrequencyData(initialArray);
    var array = transformToVisualBins(initialArray);
    ctx.clearRect(-ctx.shadowBlur, -ctx.shadowBlur, spectrumWidth + ctx.shadowBlur, spectrumHeight + ctx.shadowBlur);
    if (song.getGenre() == 'ayy lmao') {
        handleRainbowSpectrum();
    }
    ctx.fillStyle = color; // bar color

    drawSpectrum(array);
}

function drawSpectrum(array) {
    if (isPlaying) {
        updateParticleAttributes(array);

        if (lastSpectrum.length == 1) {
            lastSpectrum = array;
        }
    }

    var drawArray = isPlaying ? array : lastSpectrum;
    array = getTransformedSpectrum(array);

    // drawing pass
    for (var i = 0; i < spectrumSize; i++) {
        var value = array[i];

        if(value < 2 * resRatio) value = 2 * resRatio

        ctx.fillRect(i * (barWidth + spectrumSpacing), spectrumHeight - value, barWidth, value, value);
    }
    ctx.clearRect(0, spectrumHeight, spectrumWidth, blockTopPadding);
}

function updateParticleAttributes(array) {
    var sum = 0;
    for (var i = ampLower; i < ampUpper; i++) {
        sum += array[i] / spectrumHeight;
    }
    velMult = sum / (ampUpper - ampLower);
    particleSize = velMult;
    velMult = Math.pow(velMult, particleExponent) * (1 - absMinParticleVelocity) + absMinParticleVelocity;
    particleSize = (maxParticleSize - minParticleSize) * Math.pow(particleSize, particleSizeExponent) + minParticleSize;
}
