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

    if (song.getGenre() == 'BTC') {
        $('html').css('backgroundColor', '#E8E8E8');
        $('.content #artist').css('color', '#000');
        $('.content #title a').css('color', '#000');
        $('.content #songinfo').css('text-shadow', '0 0 0 rgba(0, 0, 0, 0.4)');
        ctx.shadowBlur = 0;
    }
}