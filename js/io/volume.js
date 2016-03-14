var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_P_UPPER = 80;
var KEY_P_LOWER = 112;

$(document).keydown(event => {
    if (event.which == KEY_UP) {
        gainNode.gain.value = Math.min(gainNode.gain.value + volumeStep, 0);
        setCookie('volume', gainNode.gain.value);
        
    } else if (event.which == KEY_DOWN) {
        gainNode.gain.value = Math.max(gainNode.gain.value - volumeStep, -1);
        setCookie('volume', gainNode.gain.value);
    }
    else {
        return;
    }

    if (volumeHidden) {
        $('#volume-info').stop(false, true);
        $('#volume-info').show();
        volumeHidden = false;
    }
    $('#volume-value').html(Math.round((gainNode.gain.value + 1) * 100) + '%');
    lastVolumeChange = Date.now();
});
