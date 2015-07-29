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
var width = $(document).width() * 0.83;
var barMargin = 7 * resRatio;
var spectrumSize = 63;
var barWidth = width / spectrumSize - barMargin;
width -= width % (barWidth + barMargin * 2);

var spectrumStart = 4; // the first bin rendered in the spectrum
var spectrumEnd = 400; // the last bin rendered in the spectrum
var spectrumScale = 1.8; // the logarithmic scale to adjust spectrum values to
var maxSpectrumExponent = 5; // the max exponent to raise spectrum values to
var minSpectrumExponent = 3; // the min exponent to raise spectrum values to
var spectrumExponentScale = 2; // the scale for spectrum exponents
var smoothingPoints = 5; // points to use for algorithmic smoothing. Must be an odd number.
var smoothingExponent = 2; // lower values = more extreme smoothing. Values below 1 may eat your firstborn.
var smoothingPasses = 5; // number of smoothing passes to execute
var temporalSmoothing = 0.35; // passed directly to the JS analyzer node

var height = width / 4.5;
var headMargin = 7;
var tailMargin = 0;
var marginDecay = 1.6;
var minMarginWeight = 0.6;
// margin weighting follows a polynomial slope passing through (0, minMarginWeight) and (marginSize, 1)
var headMarginSlope = (1 - minMarginWeight) / Math.pow(headMargin, marginDecay);
var tailMarginSlope = (1 - minMarginWeight) / Math.pow(tailMargin, marginDecay);

var maxFftSize = 16384;

var velMult = 0;

var minParticleSize = 4;
var maxParticleSize = 7;
var particleSize = minParticleSize;
var particleSizeExponent = 2;

var ampLower = 4; // the lower bound for amplitude analysis (inclusive)
var ampUpper = 30; // the upper bound for amplitude analysis (exclusive)
var particleExponent = 5; // the power to raise velMult to after initial computation
var minParticleVelocity = 0.005; // the lowest multiplier for particle speeds
var particleVelocity = 2.6; // the scalar for particle velocity

// dudududududu
var red = 255;
var green = 0;
var blue = 0;
var stage = 0;
var cycleSpeed = 4;

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
var blockWidthRatio = 0.63;
var blockHeightRatio = 0.73;

var lastMouseMove = Date.now();
var mouseSleepTime = 2000;
var textHidden = false;

$('#canvas').attr('width', width);
$('#canvas').attr('height', height + blockSize + 2 * blockTopPadding);
$('#songinfo').css('margin-top', -blockSize - blockTopPadding - 12);
$('#songinfo').css('margin-left', blockSize + blockSidePadding);
$('#songinfo').css('width', width - blockSize - blockSidePadding);
var ctx = $("#canvas").get()[0].getContext("2d");
ctx.shadowColor = 'black';
ctx.shadowBlur = 6;
ctx.shadowOffsetX = -1;
ctx.shadowOffsetY = -1;

function centerContent() {
    $('.content').css('margin-top', ($(document).height() - $('.content').height()) * 0.38);
    $('.content').css('margin-left', ($(document).width() - $('.content').width()) / 2);
}

$(window).resize(function() {
    centerContent();
});

loadSong();
setupAudioNodes();
calculateSmoothingConstants();
var prefix = window.location.href.split('/')[0] + '//' + window.location.hostname;
loadSound(prefix + '/content/uc?export=download&id=' + song.getFileId()); // music file
$('#artist').css('font-size', $('#artist').css('font-size').replace('px', '') * resRatio + 'px');
$('#title').css('font-size', $('#title').css('font-size').replace('px', '') * resRatio + 'px');
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
                    || (track.getGenre().toLowerCase()=== genreName.toLowerCase())) {
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
	var origBlur = ctx.shadowBlur;
    ctx.fillStyle = color;
    ctx.fillRect(0, height + blockTopPadding, blockSize, blockSize);
    var img = new Image();
    img.onload = function() {
		ctx.shadowBlur = 0;
        //ctx.fillStyle = 'white';
        ctx.drawImage(
            img,
            blockSize * (1 - blockWidthRatio) / 2,
            height + blockTopPadding + (blockSize * (1 - blockHeightRatio) / 2),
            blockSize * blockWidthRatio,
            blockSize * blockHeightRatio
        );
		ctx.shadowBlur = origBlur;
    };
    prefix = window.location.href.split('/')[0] + '//' + window.location.hostname
            + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    img.src = prefix + '/img/mcat.svg';
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
    ctx.clearRect(-ctx.shadowBlur, -ctx.shadowBlur, width + ctx.shadowBlur, height + ctx.shadowBlur);
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
            sum += array[i] / height;
        }
        // the next line effecitvely uses the weighted sum to generate a float between 0.0 and 1.0, 1 meaning all
        // amplitude points in the observed range are at 100% of their potential value
        velMult = sum / (ampUpper - ampLower);
        particleSize = velMult;
        velMult = Math.pow(velMult, particleExponent) * (1 - minParticleVelocity) + minParticleVelocity;
        particleSize = (maxParticleSize - minParticleSize) * Math.pow(particleSize, particleSizeExponent) + minParticleSize;
    }

    var values = [];

    for (var i = 0; i < spectrumSize; i++) {
        if (begun) {
            if (i == 0) {
                var value = array[i] / 255 * height;
            }
            else if (i == spectrumSize - 1) {
                var value = (array[i - 1] + array[i]) / 2  / 255 * height;
            }
            else {
                var value = (array[i - 1] + array[i] + array[i + 1]) / 3  / 255 * height;
            }
            value = Math.min(value + 1, height);
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
        //values[i] = Math.max(Math.pow(values[i] / height, exp) * height, 1);
    }
    
    values = triangleSmooth(values);
    
    for (var i = 0; i < values.length; i++) {
        var exp = (maxSpectrumExponent - minSpectrumExponent) * (1 - Math.pow(i / spectrumSize, spectrumExponentScale)) + minSpectrumExponent;
        values[i] = Math.max(Math.pow(values[i] / height, exp) * height, 1);
    }

    // drawing pass
    for (var i = 0; i < spectrumSize; i++) {
        var value = values[i];
        ctx.fillRect(i * (barWidth + barMargin), height - value, barWidth, value, value);
    }
    ctx.clearRect(0, height, width, blockTopPadding);
};


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
 * @param array The array to apply the algorithm to
 *
 * @return The smoothed array
 */
function triangleSmooth(array) {
    var lastArray = array;
    for (var i = 0; i < smoothingPasses; i++) {
        var newArray = [];
        for (i = 0; i < half; i++) {
            newArray[i] = lastArray[i];
            newArray[lastArray.length - i - 1] = lastArray[lastArray.length - i - 1];
        }
        for (i = half; i < lastArray.length - half; i++) {
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
