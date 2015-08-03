var mainGenres = {
	'Trap': '#8C0F28',
	'Drumstep': '#F01E87',
	'Drum & Bass': '#E10403',
	'Trance': '#0080E6', // must come before electro
	'Breaks': '#E06D61', // technically custom but must come before electro
	'Electro House': '#E5CE00', // must come before house
	'House': '#EB8200',
	'Hardcore': '#0DB106',
	'Glitch Hop': '#0A9655',
	'Post Disco': '#16ACB0',
	'Dubstep': '#941DE8',
	'Future Bass': '#979EFF',
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

    'Big Room House': 'Electro House',
    'Bounce': 'Electro House',
    'Complextro': 'Electro House',
    'Moombah': 'Electro House',
    'Outrun': 'Electro House',

    'Freeform': 'Hardcore',
    'Hard Dance': 'Hardcore',
    'Hardstyle': 'Hardcore',

    'Nu Style': 'Trance',

    'Electro Soul': 'Post Disco',
    'Indie Dance': 'Post Disco',
    'Indie Pop': 'Post Disco',
    'Nu Disco': 'Post Disco',
    'Synthpop': 'Post Disco',
    'Synthwave': 'Post Disco',

    'Brostep': 'Dubstep',
    'Garage': 'Dubstep',

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
