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

var blockSize = 192 * resRatio;
var blockTopPadding = 50 * resRatio;
var blockSidePadding = 30 * resRatio;

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
    var $artist = $('#artist');
    var $title = $('#title');

    $artist.html('???');
    $title.html('<span>???</span>');
    document.title = '[vis.js] ??? \u2014 ???';
    if (song != undefined) {
        $artist.html(selectiveToUpperCase(song.getArtist()));

        var baseArtistWidth = $('#songinfo').width();
        var baseArtistSize = $artist.css('font-size').replace('px', '');
        while ($artist[0].scrollWidth > baseArtistWidth) {
            baseArtistSize -= 1;
            $artist.css('font-size', baseArtistSize + 'px');
        }


        $title.html(selectiveToUpperCase("<span>"+song.getTitle().replace('<br>', "</span><br><span>")+"</span>"));

        var maxTitleHeight = $('#cover').height() - ($artist.height() - 10) + 7;
        var baseTitleSize = $title.css('font-size').replace('px', '');
        while ($title.height() > maxTitleHeight) {
            baseTitleSize -= 1;
            $title.css('font-size', baseTitleSize + 'px');
        }

		var fullTitle = song.getArtist().replace(/\^/g, '') + ' \u2014 ' + song.getTitle().replace('<br>', ' ').replace(/\^/g, '');
        document.title = '[vis.js] ' + fullTitle;
        color = getColor(song.getGenre());
		
		$('#loading-value').html(fullTitle);
		$('#loading-value').fadeIn();
    }
    else {
        // Trigger animations even if there is no song
        $("body").addClass("playing");
    }
    if (color == undefined) {
        color = mainGenres.EDM;
    }

    var GUI_NoCover = false;
    if (!GUI_NoCover) {
        $("#cover").css({
            left: 0,
            top: spectrumHeight + blockTopPadding,
            width: blockSize,
            height: blockSize
        })
        $("#cover div").css("background-color", color);
        $("#cover img.mcat").css({
            left: blockSize * (1 - blockWidthRatio) / 2,
            top: blockSize * (1 - blockHeightRatio) / 2,
            width: blockSize * blockWidthRatio,
            height: blockSize * blockHeightRatio
        })
        .attr("src", song.getGenre() == 'Mirai Sekai' ? 'img/mcatblack.svg' : 'img/mcat.svg')
    }

    $("#spectrum_preloader").css({
        height: 2 * resRatio,
        top: spectrumHeight - 2 * resRatio
    })
    $("#spectrum_preloader div").css("background-color", color);

    if (song.getGenre() == 'Karma Fields') {
        $('html').css('backgroundColor', '#E8E8E8');
        $('.content #artist').css('color', '#000');
        $('.content #title').css('color', '#000');
        $('.content #songinfo').css('text-shadow', '0 0 0 rgba(0, 0, 0, 0.4)');
        ctx.shadowBlur = 0;
    }
}
