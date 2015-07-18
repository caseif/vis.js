var mainGenres = {
	'Trap': '#8C0F28',
	'Drumstep': '#F12188',
	'Drum & Bass': '#FF1900',
	'Trance': '#0080E6', // must come before electro
	'Breaks': '#E06D61', // must come before electro
	'Electro': '#E5CE00', // must come before house
	'House': '#EB8200',
	'Hardcore': '#009600',
	'Glitch Hop': '#0A9655',
	'Post Disco': '#16ACB0',
	'Dubstep': '#941DE8',
	'Future Bass': '#B8B8FF',
	'EDM': '#C1C1C1',
	// begin custom colors
	'Chillout': '#F4C2C2',
    'Rock': '#B4D7BF',
	'BTC': '#000000' // this one is treated specially
};

var subgenres = {
    'Trip Hop': 'Trap',

    'Neurofunk': 'Drum & Bass',
    'Techstep': 'Drum & Bass',

    'Big Room House': 'Electro',
    'Bounce': 'Electro',
    'Complextro': 'Electro',
    'Moombah': 'Electro',
    'Outrun': 'Electro',

    'Freeform': 'Hardcore',
    'Hardstyle': 'Hardcore',

    'Nu Style': 'Trance',

    'Electro Soul': 'Post Disco',
    'Indie Dance': 'Post Disco',
    'Nu Disco': 'Post Disco',
    'Synthpop': 'Post Disco',
    'Synthwave': 'Post Disco',

    'Brostep': 'Dubstep',
    'Garage': 'Dubstep',

    'Nu Funk': 'Breaks'
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
