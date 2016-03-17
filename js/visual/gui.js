var ctx = $("#canvas").get()[0].getContext("2d");

function updateCanvas() {
    $('#canvas').attr('width', spectrumWidth);
    $('#canvas').attr('height', spectrumHeight + blockSize + 2 * blockTopPadding);
    $('#songinfo').css('margin-top', -blockSize - blockTopPadding - 12);
    $('#songinfo').css('margin-left', blockSize + blockSidePadding);
    $('#songinfo').css('width', spectrumWidth - blockSize - blockSidePadding);
    ctx.shadowColor = 'black';
    ctx.shadowBlur = spectrumShadowBlur;
    ctx.shadowOffsetX = spectrumShadowOffsetX;
    ctx.shadowOffsetY = spectrumShadowOffsetY;
}

var blockSize = 193 * resRatio;
var blockTopPadding = 50 * resRatio;
var blockSidePadding = 30 * resRatio;

function drawBlock() {
    ctx.fillStyle = color;
    ctx.fillRect(0, spectrumHeight + blockTopPadding, blockSize, blockSize);
    var img = new Image();
    img.onload = () => {
        var origBlur = ctx.shadowBlur;
		ctx.shadowBlur = 0;

        // Edge renders the shadow in front of the image for some reason, so it has to be "disabled" or the cat will
        // appear black instead of white. Shame, because it looks pretty cool.

        // We don't need to worry about a check because other browsers don't render it if the blur is 0.
        var origXOff = ctx.shadowOffsetX;
        var origYOff = ctx.shadowOffsetY;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = song.getGenre() === 'Mirai Sekai' ? 'black' : 'white';
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
    img.src = song.getGenre() == 'Mirai Sekai' ? 'img/mcatblack.svg' : 'img/mcat.svg';
}

// dudududududu
var red = 255;
var green = 0;
var blue = 0;
var stage = 0;

function handleRainbowSpectrum() {
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

function checkHideableText() {
    if (started && !textHidden && Date.now() - lastMouseMove >= mouseSleepTime) {
        textHidden = true;
        $('.hide').fadeOut(500);
    }
    if (!volumeHidden && Date.now() - lastVolumeChange >= mouseSleepTime) {
        volumeHidden = true;
        $('#volume-info').fadeOut(500);
    }
}

function initGui(song) {
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
        document.getElementById('title').innerHTML = selectiveToUpperCase(song.getTitle());
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

    if (song.getGenre() == 'Karma Fields') {
        $('html').css('backgroundColor', '#E8E8E8');
        $('.content #artist').css('color', '#000');
        $('.content #title').css('color', '#000');
        $('.content #songinfo').css('text-shadow', '0 0 0 rgba(0, 0, 0, 0.4)');
        ctx.shadowBlur = 0;
    }
}
