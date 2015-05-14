if (! window.AudioContext) {
	if (! window.webkitAudioContext) {
		alert('Could not get audio context! (Are you using IE?)');
	}
	window.AudioContext = window.webkitAudioContext;
}

var colors = {
	'EDM': '#C2C2C2',
	'House': '#EA8C00',
	'Drumstep': '#F12188',
	'Drum & Bass': '#F71A00',
	'Trance': '#0785E4',
	'Electro': '#E6CE00',
	'Glitch Hop': '#0B9753',
	'Hardcore': '#009800',
	'Nu Disco': '#1CABB1',
	'Dubstep': '#951EF5',
	'Trap': '#8C0F29',
	'Future Bass': '#B8B8FF'
};
var color;

var song;
var context = new AudioContext();
var audioBuffer;
var bufferSource;
var analyzer;
var scriptProcessor;
//var barWidth = 16;
var width = $(document).width() * 0.9;
var barCount = 80;
var barMargin = 4;
var barWidth = width / (barCount + barMargin * 2);
width -= width % (barWidth + barMargin * 2);
var spectrumSize = width / (barWidth + barMargin * 2); // the size of the visible spectrum
var spectrumStart = 5; // the first bin rendered in the spectrum
var height = width / 5;
var headMargin = 8;
var tailMargin = 8;
var marginDecay = 2;

var velMult = 0;

var amplitudeScalar = 5; // the multiplier for the particle system velocity
var ampLower = 4; // the lower bound for amplitude analysis (inclusive)
var ampUpper = 30; // the upper bound for amplitude analysis (exclusive)
var quadraticCurve = 1.5; // the power to raise velMult to after initial computation

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

var blockSize = 140;
var blockMargin = 15;
var blockWidthRatio = 0.82;
var blockHeightRatio = 0.93;

var lastMouseMove = Date.now();
var mouseSleepTime = 3000;
var textHidden = false;

$('#canvas').attr('width', width);
$('#canvas').attr('height', height + blockSize + 2 * blockMargin);
$('#songinfo').css('margin-top', -blockSize - blockMargin - 12);
$('#songinfo').css('margin-left', blockSize + blockMargin);
$('#songinfo').css('width', width - blockSize - blockMargin);
var ctx = $("#canvas").get()[0].getContext("2d");

function centerContent() {
	console.log($(document).width() + ', ' + $('.content').width() + ', ');
	$('.content').css('margin-top', ($(document).height() - $('.content').height()) / 2);
	$('.content').css('margin-left', ($(document).width() - $('.content').width()) / 2);
};	

$(window).resize(function() {
	centerContent();
});

loadSong();
setupAudioNodes();
loadSound('music/' + song.getFileName()); // music file
centerContent();

if (song.getGenre() == 'ayy lmao') {
	$('.ayylmao').show();
	$('.kitty').css('margin-top', -blockSize + 4);
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
	var loc = window.location.pathname;
	var prefix = 'http://' + window.location.hostname + loc.substring(0, loc.lastIndexOf('/'));
	var path = prefix + '/songs.csv';
	$.ajax({
		url:		path,
		success:	function(csv) {
						var lines = csv.split('\n');
						for (var i = 0; i < lines.length; i++) {
							try {
								var s = new Song(lines[i]);
								songs[s.getId()] = s;
								count = count + 1;
							} catch (ex) {} // not a song
						}
						songs.splice('undefined', 1);
					},
		async:		false
	});
	if (songName !== undefined) {
		song = songs[songName];
	} else {
		var keys = Object.keys(songs);
		var key = keys[Math.floor(Math.random() * count)];
		song = songs[key];
	}
	document.getElementById('artist').innerHTML = '???';
	document.getElementById('title').innerHTML = '???';
	document.title = '??? \u2014 ???';
	if (song != undefined) {
		var baseHeight = $('#artist').height();
		document.getElementById('artist').innerHTML = song.getArtist().toUpperCase();
		while ($('#artist').height() > baseHeight) {
			$('#artist').css('font-size', ($('#artist').css('font-size').replace('px', '') - 1) + 'px');
		}
		document.getElementById('title').innerHTML =
				(song.getLink() != null ? '<a href="' + song.getLink() + '" target="_blank">' : '')
				+ song.getTitle().toUpperCase()
				+ (song.getLink() != null ? '</a>' : '');
		document.title = song.getArtist() + ' \u2014 ' + song.getTitle();
		color = colors[song.getGenre()];
	}
	if (color == undefined) {
		color = colors['EDM']
	}
	
	if (!song || song.getGenre() != 'ayy lmao') {
		drawBlock();
	}
}

function drawBlock() {
	ctx.fillStyle = color;
	ctx.fillRect(0, height + blockMargin, blockSize, blockSize);
	var img = new Image();
	img.onload = function() {
		ctx.fillStyle = 'white';
		ctx.drawImage(
			img,
			blockSize * (1 - blockWidthRatio) / 2,
			height + blockMargin + (blockSize * (1 - blockHeightRatio) / 2),
			blockSize * blockWidthRatio,
			blockSize * blockHeightRatio
		);
	}
	var loc = window.location.pathname;
	var prefix = 'http://' + window.location.hostname + loc.substring(0, loc.lastIndexOf('/'));
	img.src = prefix + '/img/mcat.svg';
}

function setupAudioNodes() {
	scriptProcessor = context.createScriptProcessor(bufferInterval, 1, 1);
	scriptProcessor.connect(context.destination);

	analyzer = context.createAnalyser();
	analyzer.connect(scriptProcessor);
	analyzer.smoothingTimeConstant = 0.7;
	analyzer.minDecibels = -65;
	//analyzer.maxDecibels = -28;
	try {
		analyzer.fftSize = 8192; // ideal bin count
		console.log('Using fftSize of 8192 (woot!)');
	} catch (ex) {
		analyzer.fftSize = 2048; // this will work for most if not all systems
		console.log('Using fftSize of 2048');
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
			bufferSource = newSource
			bufferSource.connect(analyzer);
			bufferSource.connect(context.destination);
			bufferSource.start(0, currentTime / 1000);
			started = Date.now();
		}
		isPlaying = !isPlaying;
	}
});

function loadSound(url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	request.onload = function() {
		context.decodeAudioData(request.response, function(buffer) {
			playSound(buffer);
		}, onError);
	}
	request.send();
}


function playSound(buffer) {
	bufferSource.buffer = buffer;
	bufferSource.start(0);
	$('#loading').hide();
	$('#pause-info').show();
	isPlaying = true;
	begun = true;
	started = Date.now();
}

function onError(e) {
	console.log(e);
}

var lastLowest = -1;

var lastProcess = Date.now();
scriptProcessor.onaudioprocess = function() {
	var now = Date.now();
	do { now = Date.now(); } while (now - lastProcess < minProcessPeriod);
	lastProcess = Date.now();
	
	if (started && !textHidden && Date.now() - lastMouseMove >= mouseSleepTime) {
		$('.hide').fadeOut(500);
		textHidden = true;
	}
	
	var array =  new Uint8Array(analyzer.frequencyBinCount);
	analyzer.getByteFrequencyData(array);
	ctx.clearRect(0, 0, width, height);
	if (song.getGenre() == 'ayy lmao') {
		switch (stage) {
			case 0:
				if (green < 255) green = Math.min(green + cycleSpeed, 255);
				else ++stage;
				break;
			case 1:
				if (red > 0) red = Math.max(red - cycleSpeed, 0);
				else ++stage;
				break;
			case 2:
				if (blue < 255) blue = Math.min(blue + cycleSpeed, 255);
				else ++stage;
				break;
			case 3:
				if (green > 0) green = Math.max(green - cycleSpeed, 0);
				else ++stage;
				break;
			case 4:
				if (red < 255) red = Math.min(red + cycleSpeed, 255);
				else ++stage;
				break;
			case 5:
				if (blue > 0) blue = Math.max(blue - cycleSpeed, 0);
				else ++stage;
				break;
		}
		if (stage > 5) stage = 0;
		color = 'rgb(' + red + ',' + green + ',' + blue + ')';
	}
	ctx.fillStyle = color; // bar color
	
	if (isPlaying) {
		var sum = 0;
		for (var i = ampLower; i < ampUpper; i++) {
			sum += array[i] / height;
		}
		// the next line effecitvely uses the weighted sum to generate a float between 0.0 and 1.0, 1 meaning all
		// amplitude points in the observed range are at 100% of their potential value
		velMult = sum / (ampUpper - ampLower);
		velMult = Math.pow(velMult, quadraticCurve);
		velMult *= amplitudeScalar;
	}
	
	drawSpectrum(array);
}

var lastSpectrum = [];
var prevPeak = -1;

function drawSpectrum(array) {
	if (isPlaying && lastSpectrum.length == 1) {
		lastSpectrum = array;
	}
	var lowest = height;
	for (var i = 0; i < spectrumSize; i++) {
		var abs = i + spectrumStart;
		if (array[i + abs] < lowest) {
			lowest = array[abs];
		}
	}
	lowest /= 2;
	if (lastLowest == -1) {
		lastLowest = lowest;
	} else if (lowest < lastLowest) {
		lastLowest -= Math.min(lastLowest - lowest, 1);
	} else {
		lastLowest += Math.min(lowest - lastLowest, 1);
	}
	for (var i = 0; i < spectrumSize; i++) {
		var abs = i + spectrumStart;
		if (array[abs] >= lastLowest) {
			array[abs] = height * ((array[abs] - lastLowest) / (height - lastLowest));
		} else {
			array[abs] = 0;
		}
	}
	
	values = [];

	for (var i = 0; i < spectrumSize; i++) {
		var abs = i + spectrumStart;
		if (begun) {
			if (i == 0) {
				var value = array[abs] / 255 * height;
			}
			else if (i == spectrumSize - 1) {
				var value = (array[abs - 1] + array[abs]) / 2  / 255 * height;
			}
			else {
				var value = (array[abs - 1] + array[abs] + array[abs + 1]) / 3  / 255 * height;
			}
			value = Math.min(value + 1, height);
		} else {
			value = 1;
		}
		// create linear slope at head and tail of spectrum
		if (i < headMargin) {
			value *= Math.pow(i + 1, marginDecay) / Math.pow(headMargin, marginDecay);
		} else if (spectrumSize - i <= tailMargin) {
			value *= Math.pow(spectrumSize - i, marginDecay) / Math.pow(tailMargin, marginDecay);
		}
		
		values[i] = Math.max(Math.pow(value / height, 2.5) * height, 1);
	}
	
	// drawing pass
	for (var i = 0; i < spectrumSize; i++) {
		var value = values[i];
		ctx.fillRect(i * (barWidth + barMargin * 2), height - value, barWidth, value, value);
	}
};
