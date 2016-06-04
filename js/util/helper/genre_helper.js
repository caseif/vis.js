var mainGenres = {
    'Trap': '#820028',
    'Drumstep': '#E20386',
    'Drum & Bass': '#E10304',
    'Trance': '#0584E3', // must come before electro
    'Breaks': '#E06D61', // technically custom but must come before electro
    'Electro House': '#E2D904', // must come before house
    'House': '#E28C06',
    'Hardcore': '#0DB104',
    'Glitch Hop': '#19925B',
    'Post Disco': '#29B8B2',
    'Dubstep': '#8D03E2',
    'Future Bass': '#9999FB',
    'EDM': '#C2C1C2',
    // begin custom colors
    'Chillout': '#F4C2C2',
    'Rock': '#B4D7BF',
    'Pop': '#B3E234',
    'Pink Cloud': '#F6B4D9',
    'Karma Fields': '#000000', // this one is treated specially
    'Mirai Sekai': '#FFFFFF' // also treated specially
};

var subgenres = {
    'Trip Hop': 'Trap',

    'Neurofunk': 'Drum & Bass',
    'Techstep': 'Drum & Bass',

    'Bass House': 'Electro House',
    'Big Room House': 'Electro House',
    'Bounce': 'Electro House',
    'Complextro': 'Electro House',
    'Outrun': 'Electro House',

    'Electro Swing': 'House',

    'Freeform': 'Hardcore',
    'Hard Dance': 'Hardcore',

    'Moombah': 'Glitch Hop',
    'Neurohop': 'Glitch Hop',

    'Hardstyle': 'Trance',
    'Nu Style': 'Trance',

    'Electro Soul': 'Post Disco',
    'Indie Dance': 'Post Disco',
    'Nu Disco': 'Post Disco',
    'Synthwave': 'Post Disco',

    'Brostep': 'Dubstep',
    'Garage': 'Dubstep',
    'Neurostep': 'Dubstep',
    'Riddim': 'Dubstep',

    'Nu Funk': 'Breaks',

    'Downtempo': 'Chillout',

    'Neofolk': 'Rock',
    
    'Industrial': 'EDM'
};

function getColor(genre) {
    genre = genre.toLowerCase().replace('-', ' ');
    for (var key in subgenres) {
        if (genre.indexOf(key.toLowerCase()) !== -1) {
            return mainGenres[subgenres[key]];
        }
    }
    for (var key in mainGenres) {
        if (genre.indexOf(key.toLowerCase()) !== -1) {
            return mainGenres[key];
        }
    }
    return mainGenres['EDM'];
}
