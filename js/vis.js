if (!window.AudioContext) {
    if (!window.webkitAudioContext) {
        alert('Could not get audio context! (Are you using IE?)');
    }
    window.AudioContext = window.webkitAudioContext;
}

var color;

var spectrumWidth = 1568 * resRatio;
spectrumSpacing = 7 * resRatio;
var barWidth = (spectrumWidth + spectrumSpacing) / spectrumSize - spectrumSpacing;
spectrumWidth = (barWidth + spectrumSpacing) * spectrumSize - spectrumSpacing;

var spectrumHeight = spectrumWidth / spectrumDimensionScalar;
var marginDecay = 1.6; // I admittedly forget how this works but it probably shouldn't be changed from 1.6
// margin weighting follows a polynomial slope passing through (0, minMarginWeight) and (marginSize, 1)
var headMarginSlope = (1 - minMarginWeight) / Math.pow(headMargin, marginDecay);
var tailMarginSlope = (1 - minMarginWeight) / Math.pow(tailMargin, marginDecay);

var velMult = 0;
var particleSize = minParticleSize;

var begun = false;
var ended = false;
var isPlaying = false;
var bufferInterval = 1024;
var started = 0;
var currentTime = 0;
var minProcessPeriod = 18; // ms between calls to the process function

var lastMouseMove = Date.now();
var lastVolumeChange = Date.now();
var textHidden = false;
var volumeHidden = false;

updateCanvas();

function centerContent() {
    resRatio = $(window).width() / 1920;

    $('.content').css({
        width: (1568 * resRatio) + "px",
        marginTop: (196 * resRatio) + "px"
    });
    $('#canvas').attr("width", 1568 * resRatio);
}

$(window).resize(() => { centerContent() });
centerContent();

$('#artist').css('font-size', $('#artist').css('font-size').replace('px', '') * resRatio + 'px');
$('#title').css('font-size', $('#title').css('font-size').replace('px', '') * resRatio + 'px');
loadSong();
setupAudioNodes();
var prefix = window.location.href.split('/')[0] + '//' + window.location.hostname;
loadSound(prefix + '/content/uc?export=download&id=' + song.getFileId()); // music file
$('#songinfo').css('padding-top', (blockSize - $('#songinfo').height()) / 2);
centerContent();
initSpectrumHandler();

if (song.getGenre() == 'ayy lmao') {
    $('#cover div').append('<img class="kitty" src="./img/cat.gif" alt="ayy lmao">');
}

if (song.getGenre() == 'Mirai Sekai') {
    $('.partsbg').hide();
    $('#vig').hide();
    $('.content').css('textShadow','0px 0px 20px rgba(0, 0, 0, 0.9)');
    $('.mvbg').html('<video autoplay loop id="bgvid"><source src="'
            + prefix + '/content/uc?export=download&id=0B8_nDMQp-qqCU0ZmcHNfR1pwZ0E" type="video/webm"></video>');
} else if (song.getGenre() == 'Pink Cloud') {
    var arr = ['7YBEo6D', 'Bbpq19Q', '6MPcxXC'];
    $('.mvbg').html('<img src="https://i.imgur.com/' + arr[Math.floor(Math.random() * arr.length)]
            + '.jpg" width="100%">');
}

$('html').mousemove(event => {
    if (textHidden) {
        $('.hide').stop(false, true);
        $('.hide').show();
        textHidden = false;
    }
    lastMouseMove = Date.now();
});
