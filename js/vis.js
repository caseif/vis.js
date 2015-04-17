if (! window.AudioContext) {
	if (! window.webkitAudioContext) {
		alert('Could not get audio context! (Are you using IE?)');
	}
	window.AudioContext = window.webkitAudioContext;
}

var colors = {
	'EDM': '#C2C1C3',
	'House': '#EB8C00',
	'Drumstep': '#F22189',
	'Drum & Bass': '#F61A03',
	'Trance': '#007FE8',
	'Electro': '#E7CD00',
	'Glitch Hop': '#0C9758',
	'Hardcore': '#009800',
	'Nu Disco': '#1DAAB4',
	'Dubstep': '#961EEA',
	'Trap': '#8C0F29',
	'Future Bass': '#B8B8FF'
};

var context = new AudioContext();
var audioBuffer;
var sourceNode;
var analyser;
var javascriptNode;
var barWidth = 16;
var barMargin = 3;
var width = $(document).width() * 0.9;
width -= width % (barWidth + barMargin * 2)
var height = 325;

var velMult = 1;

var amplitudeScalar = 5; // the multiplier for the particle system velocity
var ampAnalysisStart = 0; // the start of the spectrum section used to determine the speed of the particles
var ampAnalysisLength = 0.5; // the length of the spectrum section used to determine the speed of the particles
var minAmpBias = 0.5; // the minimum weight applied to any given amplitude point

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

if (genre == 'ayy lmao') {
	$('.ayylmao').show();
	$('.kitty').css('margin-top', -$('#songinfo').height() + 17);
	$('.kitty').attr('height', $('#songinfo').height() - 20);
	$('#songinfo').css('margin-left', $('.kitty').width() + 16);
}

//$(".content").hide();
$('#canvas').attr('width', width);
$('#canvas').attr('height', height);
var ctx = $("#canvas").get()[0].getContext("2d");

setupAudioNodes();
loadSound('music/' + file); //music file

function setupAudioNodes() {
	javascriptNode = context.createScriptProcessor(bufferInterval, 1, 1);
	javascriptNode.connect(context.destination);

	analyser = context.createAnalyser();
	analyser.smoothingTimeConstant = 0.8;
	analyser.fftSize = 512;

	sourceNode = context.createBufferSource();
	sourceNode.connect(analyser);
	analyser.connect(javascriptNode);

	sourceNode.connect(context.destination);
}

$(document).keypress(function(event) {
	if (event.which == 80 || event.which == 112) {
		if (isPlaying) {
			sourceNode.stop();
			currentTime += Date.now() - started;
			velMult = 0;
		} else {
			var newSource = context.createBufferSource();
			newSource.buffer = sourceNode.buffer;
			sourceNode = newSource
			sourceNode.connect(analyser);
			sourceNode.connect(context.destination);
			sourceNode.start(0, currentTime / 1000);
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
	sourceNode.buffer = buffer;
	sourceNode.start(0);
	//$(".content").show();
	$("#loading").hide();
	isPlaying = true;
	begun = true;
	started = Date.now();
}

function onError(e) {
	console.log(e);
}

javascriptNode.onaudioprocess = function() {
	var array =  new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(array);
	ctx.clearRect(0, 0, width, height);
	if (genre == 'ayy lmao') {
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
		ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
	} else {
		ctx.fillStyle = colors[genre] != undefined ? colors[genre] : colors['EDM']; //bar color
	}
	drawSpectrum(array);
}

var lastSpectrum = null;

function drawSpectrum(array) {
	var sum = 0;
	var arraySectionLength = array.length * (ampAnalysisLength - ampAnalysisStart);
	for (var i = 0; i < array.length; i++){
		if (isPlaying) {
			lastSpectrum = array;
		} else if (lastSpectrum != null) {
			array = lastSpectrum;
		}
		if (begun) {
			if (i == 0) {
				var value = array[i];
			}
			else if (i == array.length - 1) {
				var value = (array[i - 1] + array[i]) / 2;
			}
			else {
				var value = (array[i - 1] + array[i] + array[i + 1]) / 3;
			}
			value = Math.min(value + 1, height);
			if (i >= array.length * ampAnalysisStart && i < array.length * ampAnalysisLength) {
				var bias = ((arraySectionLength / minAmpBias - i) / (arraySectionLength / minAmpBias));
				sum += (value / height) * bias;
			}
		} else {
			value = 1;
		}
		ctx.fillRect(i * (barWidth + barMargin * 2), height - value, barWidth, value, value);
	}
	if (isPlaying) {
		velMult = sum / arraySectionLength * (amplitudeScalar * (1 + minAmpBias));
	}
};
