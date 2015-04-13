if (! window.AudioContext) {
	if (! window.webkitAudioContext) {
		alert('no audiocontext found, update your browser yo');
	}
	window.AudioContext = window.webkitAudioContext;
}

var context = new AudioContext();
var audioBuffer;
var sourceNode;
var analyser;
var javascriptNode;
var height = 325;

$(".content").hide();
var ctx = $("#canvas").get()[0].getContext("2d");

setupAudioNodes();
loadSound('music/' + file); //music file

function setupAudioNodes() {
	javascriptNode = context.createScriptProcessor(4096, 1, 1);
	javascriptNode.connect(context.destination);

	analyser = context.createAnalyser();
	analyser.smoothingTimeConstant = 0.8;
	analyser.fftSize = 1024; //don't change!

	sourceNode = context.createBufferSource();
	sourceNode.connect(analyser);
	analyser.connect(javascriptNode);

	sourceNode.connect(context.destination);
}

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
	$(".content").show();
	$("#hue").hide();
}

function onError(e) {
	console.log(e);
}

javascriptNode.onaudioprocess = function() {
	var array =  new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(array);
	ctx.clearRect(0, 0, 1000, height);
	ctx.fillStyle="#BBB"; //bar color
	drawSpectrum(array);
}


function drawSpectrum(array) {
	//var newArray = new Uint8Array(array.length);
	for (var i = 0; i < (array.length); i++){
		if (i == 0) {
			var value = array[i];
		}
		else if (i == array.length - 1) {
			var value = (array[i - 1] + array[i]) / 2;
		}
		else {
			var value = (array[i - 1] + array[i] + array[i + 1]) / 3;
		}
		//newArray[i] = value;
		ctx.fillRect(i * 17, height - value, 10, height); //1st value = bar side margins
	}
};