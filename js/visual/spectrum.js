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

var spectrumAnimation = "phase_1";
var spectrumAnimationStart = 0;

function drawSpectrum(array) {
    if (isPlaying) {
        updateParticleAttributes(array);

        if (lastSpectrum.length == 1) {
            lastSpectrum = array;
        }
    }

    var drawArray = isPlaying ? array : lastSpectrum;
    array = getTransformedSpectrum(array);

    var now = Date.now();

    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = spectrumShadowBlur;
    ctx.shadowOffsetX = spectrumShadowOffsetX;
    ctx.shadowOffsetY = spectrumShadowOffsetY;

    if (spectrumAnimation == "phase_1") {
        var ratio = (now - started) / 500;

        ctx.fillRect(0, spectrumHeight - 2 * resRatio, (spectrumWidth/2) * ratio, 2 * resRatio);
        ctx.fillRect(spectrumWidth - (spectrumWidth/2) * ratio, spectrumHeight - 2 * resRatio, (spectrumWidth/2) * ratio, 2 * resRatio);

        if (ratio > 1) {
            spectrumAnimation = "phase_2";
            spectrumAnimationStart = now;
        }
    } else if (spectrumAnimation == "phase_2") {
        var ratio = (now - spectrumAnimationStart) / 500;

        ctx.globalAlpha = Math.abs(Math.cos(ratio*10));

        ctx.fillRect(0, spectrumHeight - 2 * resRatio, spectrumWidth, 2 * resRatio);

        ctx.globalAlpha = 1;

        if (ratio > 1) {
            spectrumAnimation = "phase_3";
            spectrumAnimationStart = now;
        }
    } else if (spectrumAnimation == "phase_3") {
        var ratio = (now - spectrumAnimationStart) / 1000;

        // drawing pass
        for (var i = 0; i < spectrumSize; i++) {
            var value = array[i];

            // Used to smooth transiton between bar & full spectrum (lasts 1 sec)
            if (ratio < 1) {
                value = value / (1 + 9 - 9 * ratio); 
            }

            if (value < 2 * resRatio) {
                value = 2 * resRatio;
            }

            ctx.fillRect(i * (barWidth + spectrumSpacing), spectrumHeight - value, barWidth, value, value);
        }
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
