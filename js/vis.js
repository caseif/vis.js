if (!window.AudioContext) {
    if (!window.webkitAudioContext) {
        alert('Could not get audio context! (Are you using IE?)');
    }
    window.AudioContext = window.webkitAudioContext;
}

var color;

var song;
var context = new AudioContext();
var audioBuffer;
var bufferSource;
var analyzer;
var scriptProcessor;

var spectrumWidth = $(document).width() * 0.83;
spectrumSpacing *= resRatio;
var barWidth = spectrumWidth / spectrumSize - spectrumSpacing;
spectrumWidth -= spectrumWidth % (barWidth + spectrumSpacing * 2);

var spectrumHeight = spectrumWidth / spectrumDimensionScalar;
var marginDecay = 1.6; // I admittedly forget how this works but it probably shouldn't be changed from 1.6
// margin weighting follows a polynomial slope passing through (0, minMarginWeight) and (marginSize, 1)
var headMarginSlope = (1 - minMarginWeight) / Math.pow(headMargin, marginDecay);
var tailMarginSlope = (1 - minMarginWeight) / Math.pow(tailMargin, marginDecay);

var velMult = 0;
var particleSize = minParticleSize;

// dudududududu
var red = 255;
var green = 0;
var blue = 0;
var stage = 0;

var begun = false;
var ended = false;
var isPlaying = false;
var bufferInterval = 1024;
var started = 0;
var currentTime = 0;
var minProcessPeriod = 18; // ms between calls to the process function

var blockSize = 193 * resRatio;
var blockTopPadding = 50 * resRatio;
var blockSidePadding = 30 * resRatio;

var lastMouseMove = Date.now();
var textHidden = false;

$('#canvas').attr('width', spectrumWidth);
$('#canvas').attr('height', spectrumHeight + blockSize + 2 * blockTopPadding);
$('#songinfo').css('margin-top', -blockSize - blockTopPadding - 12);
$('#songinfo').css('margin-left', blockSize + blockSidePadding);
$('#songinfo').css('width', spectrumWidth - blockSize - blockSidePadding);
var ctx = $("#canvas").get()[0].getContext("2d");
ctx.shadowColor = 'black';
ctx.shadowBlur = spectrumShadowBlur;
ctx.shadowOffsetX = spectrumShadowOffsetX;
ctx.shadowOffsetY = spectrumShadowOffsetY;

function centerContent() {
    $('.content').css('margin-top', ($(document).height() - $('.content').height()) * 0.38);
    $('.content').css('margin-left', ($(document).width() - $('.content').width()) / 2);
}

$(window).resize(function() {
    centerContent();
});

$('#artist').css('font-size', $('#artist').css('font-size').replace('px', '') * resRatio + 'px');
$('#title').css('font-size', $('#title').css('font-size').replace('px', '') * resRatio + 'px');
loadSong();
setupAudioNodes();
//calculateSmoothingConstants(); // only necessary for triangular smoothing
var prefix = window.location.href.split('/')[0] + '//' + window.location.hostname;
loadSound(prefix + '/content/uc?export=download&id=' + song.getFileId()); // music file
$('#songinfo').css('padding-top', (blockSize - $('#songinfo').height()) / 2);
centerContent();

if (song.getGenre() == 'ayy lmao') {
    $('.ayylmao').show();
    $('.kitty').css('margin-top', -blockSize + blockTopPadding - 21);
    $('.kitty').attr('height', blockSize);
}

$('html').mousemove(function(event) {
    if (textHidden) {
        $('.hide').show();
        textHidden = false;
    }
    lastMouseMove = Date.now();
});

function loadSong() {
    var songs = [];
    var count = 0;
    prefix = window.location.href.split('/')[0] + '//' + window.location.hostname
            + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    var path = prefix + '/songs.csv';
    $.ajax({
        url:        path,
        success:    function(csv) {
                        var lines = csv.split('\n');
                        lines.forEach(function(line) {
                            try {
                                var s = new Song(line);
                                songs[s.getId()] = s;
                                count = count + 1;
                            } catch (ignored) {
                                var i = 0; // not a song (useless statement to keep JSLint happy)
                            }
                        });
                        songs.splice('undefined', 1);
                    },
        async:        false
    });
    var keys = Object.keys(songs);
    var subArray = [];
    var i = 0;
    if (songName !== undefined) {
        song = songs[songName.toLowerCase()];
    } else if (subgenreName !== undefined) {
        keys.forEach(function(key) {
            var track = songs[key];
            if (track.getGenre().toLowerCase() === subgenreName.toLowerCase()) {
                subArray[i] = track;
                ++i;
            }
        });
        song = subArray[Math.floor(Math.random() * subArray.length)];
    } else if (genreName !== undefined) {
        keys.forEach(function(key) {
            var track = songs[key];
            if ((subgenres[track.getGenre()] !== undefined && subgenres[track.getGenre()].toLowerCase() === genreName.toLowerCase())
                    || (track.getGenre().toLowerCase().indexOf(genreName.toLowerCase()) !== -1)) {
                subArray[i] = track;
                ++i;
            }
        });
        song = subArray[Math.floor(Math.random() * subArray.length)];
    } else if (artistName !== undefined) {
        keys.forEach(function(key) {
            var track = songs[key];
            if (track.getArtist().toLowerCase().replace(/\^/g, '') === artistName.toLowerCase()) {
                subArray[i] = track;
                ++i;
            }
        });
        song = subArray[Math.floor(Math.random() * subArray.length)];
    } else {
        var key = keys[Math.floor(Math.random() * count)];
        song = songs[key];
    }
    document.getElementById('artist').innerHTML = '???';
    document.getElementById('title').innerHTML = '???';
    document.title = '[vis.js] ??? \u2014 ???';
    if (song != undefined) {
        var baseArtistHeight = $('#artist').height();
        document.getElementById('artist').innerHTML = selectiveToUpperCase(song.getArtist());

        while ($('#artist').height() >= baseArtistHeight) {
            $('#artist').css('font-size', ($('#artist').css('font-size').replace('px', '') - 1) + 'px');
        }
        $('#artist').css('font-size', ($('#artist').css('font-size').replace('px', '') - 5) + 'px');
        var baseTitleHeight = $('#title').height();
        document.getElementById('title').innerHTML =
                (song.getLink() != null ? '<a href="' + song.getLink() + '" target="_blank">' : '')
                + selectiveToUpperCase(song.getTitle())
                + (song.getLink() != null ? '</a>' : '');
        var newLines = (song.getTitle().length - song.getTitle().replace('<br>', '').replace(/\^/g, '').length) / 4 + 1;
        while ($('#title').height() >= baseTitleHeight * newLines) {
            $('#title').css('font-size', ($('#title').css('font-size').replace('px', '') - 1) + 'px');
        }
            $('#title').css('font-size', ($('#title').css('font-size').replace('px', '') - 5) + 'px');
        document.title = '[vis.js] ' + song.getArtist().replace(/\^/g, '') + ' \u2014 ' + song.getTitle().replace('<br>', ' ').replace(/\^/g, '');
        color = getColor(song.getGenre());
    }
    if (color == undefined) {
        color = mainGenres.EDM;
    }

    if (!song || song.getGenre() != 'ayy lmao') {
        drawBlock();
    }

    if (song.getGenre() == 'BTC') {
        $('html').css('backgroundColor', '#E8E8E8');
        $('.content #artist').css('color', '#000');
        $('.content #title a').css('color', '#000');
        ctx.shadowBlur = 0;
    }
}

function drawBlock() {
    ctx.fillStyle = color;
    ctx.fillRect(0, spectrumHeight + blockTopPadding, blockSize, blockSize);
    var img = new Image();
    img.onload = function() {
        var origBlur = ctx.shadowBlur;
		ctx.shadowBlur = 0;

        // Edge renders the shadow in front of the image for some reason, so it has to be "disabled" or the cat will
        // appear black instead of white. Shame, because it looks pretty cool.

        // We don't need to worry about a check because other browsers don't render it if the blur is 0.
        var origXOff = ctx.shadowOffsetX;
        var origYOff = ctx.shadowOffsetY;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = 'white';
        ctx.drawImage(
            img,
            blockSize * (1 - blockWidthRatio) / 2,
            spectrumHeight + blockTopPadding + (blockSize * (1 - blockHeightRatio) / 2),
            blockSize * blockWidthRatio,
            blockSize * blockHeightRatio
        );
		ctx.shadowBlur = origBlur;
        ctx.shadowOffsetX = origXOff;
        ctx.shadowOffsetY = origYOff;
    };
    prefix = window.location.href.split('/')[0] + '//' + window.location.hostname
            + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    img.src = '/img/mcat.svg'
}

function setupAudioNodes() {
    scriptProcessor = context.createScriptProcessor(bufferInterval, 1, 1);
    scriptProcessor.connect(context.destination);

    analyzer = context.createAnalyser();
    analyzer.connect(scriptProcessor);
    analyzer.smoothingTimeConstant = temporalSmoothing;
    analyzer.minDecibels = -110;
    analyzer.maxDecibels = -30;
    try {
        analyzer.fftSize = maxFftSize; // ideal bin count
        console.log('Using fftSize of ' + analyzer.fftSize + ' (woot!)');
    } catch (ex) {
        analyzer.fftSize = 2048; // this will work for most if not all systems
        console.log('Using fftSize of ' + analyzer.fftSize);
        alert('Could not set optimal fftSize! This may look a bit weird...');
    }

    bufferSource = context.createBufferSource();
    bufferSource.connect(analyzer);
    bufferSource.connect(context.destination);
}

$(document).keypress(function(event) {
    if (event.which == 80 || event.which == 112) {
        if (isPlaying) {
            bufferSource.stop();
            currentTime += Date.now() - started;
            velMult = 0;
        } else {
            var newSource = context.createBufferSource();
            newSource.buffer = bufferSource.buffer;
            bufferSource = newSource;
            bufferSource.connect(analyzer);
            bufferSource.connect(context.destination);
            bufferSource.start(0, currentTime / 1000);
            started = Date.now();
        }
        isPlaying = !isPlaying;
    }
});

function createCORSRequest(method, url){
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr){
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined"){
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

function loadSound(url) {
    //var request = new XMLHttpRequest();
    //request.open('GET', url, true);
    var request = createCORSRequest('GET', url);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            playSound(buffer);
        }, onError);
    };
    request.send();
}


function playSound(buffer) {
    bufferSource.buffer = buffer;
    bufferSource.start(0);
    $('#status').fadeOut(); // will first fade out the loading animation
    $('#preloader').fadeOut('slow'); // will fade out the grey DIV that covers the website.
    isPlaying = true;
    begun = true;
    started = Date.now();
}

bufferSource.onended = function() {
    if (started && isPlaying) {
        location.reload(); // refresh when the song ends
    }
};

function onError(e) {
    console.log(e);
}

var lastProcess = Date.now();
scriptProcessor.onaudioprocess = function() {
    var now = Date.now();
    do { now = Date.now(); } while (now - lastProcess < minProcessPeriod);
    lastProcess = Date.now();

    if (started && !textHidden && Date.now() - lastMouseMove >= mouseSleepTime) {
        $('.hide').fadeOut(500);
        textHidden = true;
    }

    var initialArray =  new Uint8Array(analyzer.frequencyBinCount);
    analyzer.getByteFrequencyData(initialArray);
    var array = powerTransform(initialArray);
    ctx.clearRect(-ctx.shadowBlur, -ctx.shadowBlur, spectrumWidth + ctx.shadowBlur, spectrumHeight + ctx.shadowBlur);
    if (song.getGenre() == 'ayy lmao') {
        switch (stage) {
            case 0:
                if (green < 255) {
                    green = Math.min(green + cycleSpeed, 255);
                } else {
                    ++stage;
                }
                break;
            case 1:
                if (red > 0) {
                    red = Math.max(red - cycleSpeed, 0);
                } else {
                    ++stage;
                }
                break;
            case 2:
                if (blue < 255) {
                    blue = Math.min(blue + cycleSpeed, 255);
                } else {
                    ++stage;
                }
                break;
            case 3:
                if (green > 0) {
                    green = Math.max(green - cycleSpeed, 0);
                } else {
                    ++stage;
                }
                break;
            case 4:
                if (red < 255) {
                    red = Math.min(red + cycleSpeed, 255);
                } else {
                    ++stage;
                }
                break;
            case 5:
                if (blue > 0) {
                    blue = Math.max(blue - cycleSpeed, 0);
                } else {
                    ++stage;
                }
                break;
        }
        if (stage > 5) {
            stage = 0;
        }
        color = 'rgb(' + red + ',' + green + ',' + blue + ')';
    }
    ctx.fillStyle = color; // bar color

    drawSpectrum(array);
};

function powerTransform(array) {
    var newArray = new Uint8Array(spectrumSize);
    for (var i = 0; i < spectrumSize; i++) {
        //newArray[i] = array[i + spectrumStart];
        var bin = Math.pow(i / spectrumSize, spectrumScale) * (spectrumEnd - spectrumStart) + spectrumStart;
        newArray[i] = array[Math.floor(bin) + spectrumStart] * (bin % 1)
                + array[Math.floor(bin + 1) + spectrumStart] * (1 - (bin % 1))
    }
    return newArray;
}

var lastSpectrum = [];
var prevPeak = -1;

function drawSpectrum(array) {
    if (isPlaying && lastSpectrum.length == 1) {
        lastSpectrum = array;
    }

    if (isPlaying) {
        var sum = 0;
        for (var i = ampLower; i < ampUpper; i++) {
            sum += array[i] / spectrumHeight;
        }
        velMult = sum / (ampUpper - ampLower);
        particleSize = velMult;
        velMult = Math.pow(velMult, particleExponent) * (1 - minParticleVelocity) + minParticleVelocity;
        particleSize = (maxParticleSize - minParticleSize) * Math.pow(particleSize, particleSizeExponent) + minParticleSize;
    }

    var values = [];

    for (var i = 0; i < spectrumSize; i++) {
        if (begun) {
            if (i == 0) {
                var value = array[i] / 255 * spectrumHeight;
            }
            else if (i == spectrumSize - 1) {
                var value = (array[i - 1] + array[i]) / 2  / 255 * spectrumHeight;
            }
            else {
                var value = (array[i - 1] + array[i] + array[i + 1]) / 3  / 255 * spectrumHeight;
            }
            value = Math.min(value + 1, spectrumHeight);
        } else {
            value = 1;
        }
        // create linear slope at head and tail of spectrum
        if (i < headMargin) {
            //value *= Math.pow(i + 1, marginDecay) / Math.pow(headMargin, marginDecay);
            value *= headMarginSlope * Math.pow(i + 1, marginDecay) + minMarginWeight;
        } else if (spectrumSize - i <= tailMargin) {
            //value *= Math.pow(spectrumSize - i, marginDecay) / Math.pow(tailMargin, marginDecay);
            value *= tailMarginSlope * Math.pow(spectrumSize - i, marginDecay) + minMarginWeight;
        }

        values[i] = value;
        //values[i] = Math.max(Math.pow(values[i] / spectrumHeight, exp) * spectrumHeight, 1);
    }
    
    //values = triangleSmooth(values);
    values = smooth(values);
    
    for (var i = 0; i < values.length; i++) {
        var exp = (spectrumMaxExponent - spectrumMinExponent) * (1 - Math.pow(i / spectrumSize, spectrumExponentScale)) + spectrumMinExponent;
        values[i] = Math.max(Math.pow(values[i] / spectrumHeight, exp) * spectrumHeight, 1);
    }

    // drawing pass
    for (var i = 0; i < spectrumSize; i++) {
        var value = values[i];
        ctx.fillRect(i * (barWidth + spectrumSpacing), spectrumHeight - value, barWidth, value, value);
    }
    ctx.clearRect(0, spectrumHeight, spectrumWidth, blockTopPadding);
};

// mostly for debugging purposes
function smooth(array) {
    return savitskyGolaySmooth(array);
}


// Technically this should be in util.js but I need optimization and I don't
// feel like restructuring to allow use of this file's smoothing constants
function calculateSmoothingConstants() {
    half = Math.floor(smoothingPoints / 2); // I got sick of calling Math.floor() since JS is weakly-typed
    smoothingDivisor = fuckyTriangleSumThing(half + 1, smoothingExponent);
    powers = [];
    for (i = 0; i <= half; i++) {
        powers[i] = Math.pow(i + 1, smoothingExponent);
    }
}

/**
 * Applies a triangular smoothing algorithm to the given array.
 *
 * Note: not used at the moment.
 *
 * @param array The array to apply the algorithm to
 *
 * @return The smoothed array
 */
function triangleSmooth(array) {
    var lastArray = array;
    for (var pass = 0; pass < smoothingPasses; pass++) {
        var newArray = [];
        for (var i = 0; i < half; i++) {
            newArray[i] = lastArray[i];
            newArray[lastArray.length - i - 1] = lastArray[lastArray.length - i - 1];
        }
        for (var i = half; i < lastArray.length - half; i++) {
            var midScalar = half + 1;
            var sum = lastArray[i] * powers[half];
            for (j = 1; j <= half; j++) {
                sum += lastArray[i + j] * powers[midScalar - j - 1];
                sum += lastArray[i - j] * powers[midScalar - j - 1];
            }
            newArray[i] = sum / smoothingDivisor;
        }
        lastArray = newArray;
    }
    return lastArray;
}

/**
 * Applies a Savitsky-Golay smoothing algorithm to the given array.
 *
 * See {@link http://www.wire.tu-bs.de/OLDWEB/mameyer/cmr/savgol.pdf} for more
 * info.
 *
 * @param array The array to apply the algorithm to
 *
 * @return The smoothed array
 */
function savitskyGolaySmooth(array) {
    var lastArray = array;
    for (var pass = 0; pass < smoothingPasses; pass++) {
        var sidePoints = Math.floor(smoothingPoints / 2); // our window is centered so this is both nL and nR
        var cn = 1 / (2 * sidePoints + 1); // constant
        var newArray = [];
        for (var i = 0; i < sidePoints; i++) {
            newArray[i] = lastArray[i];
            newArray[lastArray.length - i - 1] = lastArray[lastArray.length - i - 1];
        }
        for (var i = sidePoints; i < lastArray.length - sidePoints; i++) {
            var sum = 0;
            for (var n = -sidePoints; n <= sidePoints; n++) {
                sum += cn * lastArray[i + n] + n;
            }
            newArray[i] = sum;
        }
        lastArray = newArray;
    }
    return newArray;
}
