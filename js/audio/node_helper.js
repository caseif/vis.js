var context = new AudioContext();
var gainNode;
var audioBuffer;
var bufferSource;
var analyzer;
var scriptProcessor;

function setupAudioNodes() {
    bufferSource = context.createBufferSource();
    setOnEnded();
    bufferSource.connect(context.destination);

    gainNode = context.createGain();
    gainNode.gain.value = 0;
    bufferSource.connect(gainNode);
    gainNode.connect(context.destination);
    var vol = getCookie('volume');
    if (vol != null) {
        gainNode.gain.value = vol;
    }

    scriptProcessor = context.createScriptProcessor(bufferInterval, 1, 1);
    scriptProcessor.connect(context.destination);

    analyzer = context.createAnalyser();
    analyzer.connect(scriptProcessor);
    analyzer.smoothingTimeConstant = temporalSmoothing;
    analyzer.minDecibels = -100;
    analyzer.maxDecibels = -33;
    try {
        analyzer.fftSize = maxFftSize; // ideal bin count
        console.log('Using fftSize of ' + analyzer.fftSize + ' (woot!)');
    } catch (ex) {
        analyzer.fftSize = 2048; // this will work for most if not all systems
        console.log('Using fftSize of ' + analyzer.fftSize);
        alert('Could not set optimal fftSize! This may look a bit weird...');
    }
    bufferSource.connect(analyzer);
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

function setOnEnded() {
    bufferSource.onended = () => {
        if (started && isPlaying) {
            location.reload(); // refresh when the song ends
        }
    };
}
