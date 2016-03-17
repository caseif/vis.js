var song;

function loadSong() {
    var songs = [];
    var count = 0;
    prefix = window.location.href.split('/')[0] + '//' + window.location.hostname
            + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    var path = prefix + '/songs.csv';
    $.ajax({
        url:        path,
        success:    csv => {
                        var lines = csv.split('\n');
                        lines.forEach(line => {
                            try {
                                var s = new Song(line);
                                songs[s.getId()] = s;
                                count = count + 1;
                            } catch (ignored) {
                                // not a song (useless statement to keep JSLint happy)
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
        keys.forEach(key => {
            var track = songs[key];
            if (track.getGenre().toLowerCase() === subgenreName.toLowerCase()) {
                subArray[i] = track;
                ++i;
            }
        });
        song = subArray[Math.floor(Math.random() * subArray.length)];
    } else if (genreName !== undefined) {
        keys.forEach(key => {
            var track = songs[key];
            if ((subgenres[track.getGenre()] !== undefined && subgenres[track.getGenre()].toLowerCase() === genreName.toLowerCase())
                    || (track.getGenre().toLowerCase().indexOf(genreName.toLowerCase()) !== -1)) {
                subArray[i] = track;
                ++i;
            }
        });
        song = subArray[Math.floor(Math.random() * subArray.length)];
    } else if (artistName !== undefined) {
        keys.forEach(key => {
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
    initGui(song);
}