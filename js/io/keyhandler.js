$(document).keypress(event => {
    if (event.which == KEY_P_UPPER || event.which == KEY_P_LOWER) {
        if (started) {
            if (isPlaying) {
                delayNode.delayTime.value = 0;
                bufferSource.stop();
                currentTime += Date.now() - started;
                velMult = 0;
            } else {
                var newSource = context.createBufferSource();
                newSource.buffer = bufferSource.buffer;
                bufferSource = newSource;
                setOnEnded();
                bufferSource.connect(analyzer);
                bufferSource.connect(muteGainNode);
                bufferSource.connect(gainNode);
                delayNode.delayTime.value = audioDelay;
                bufferSource.connect(delayNode);
                bufferSource.connect(context.destination);
                bufferSource.start(0, currentTime / 1000);
                started = Date.now();
            }
            isPlaying = !isPlaying;
        }
    }
});
