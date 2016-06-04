function Song(rawData) {
    if (rawData != '' && !rawData.match('^#')) { // check it's not a comment or an empty line
        var data = rawData.split('\|');
        if (data.length < 5) {
            throw 'Invalid song data';
        }
        this.id = data[0];
        this.artist = data[1];
        this.title = data[2];
        this.genre = data[3];
        this.file = data[4];
    } else {
        throw 'non-song';
    }
}

Song.prototype.getId = function() {
    return this.id;
}

Song.prototype.getArtist = function() {
    return this.artist;
}

Song.prototype.getTitle = function() {
    return this.title;
}

Song.prototype.getGenre = function() {
    return this.genre;
}

Song.prototype.getFileId = function() {
    return this.file;
}
