function brighten(hexString, factor) {
    hexString = hexString.replace('#', '');
    var redHex = hexString.substring(0, 2);
    var greenHex = hexString.substring(2, 4);
    var blueHex = hexString.substring(4, 6);
    var newRed = Math.floor((parseInt('0x' + redHex) * (1 / factor) + 255 * ((factor - 1) / factor)));
    var newGreen = Math.floor((parseInt('0x' + greenHex) * (1 / factor) + 255 * ((factor - 1) / factor)));
    var newBlue = Math.floor((parseInt('0x' + blueHex) * (1 / factor) + 255 * ((factor - 1) / factor)));
    var newColor = '#'
            + newRed.toString(16).toUpperCase()
            + newGreen.toString(16).toUpperCase()
            + newBlue.toString(16).toUpperCase();
    return newColor;
}

function darken(hexString, factor) {
    hexString = hexString.replace('#', '');
    var redHex = hexString.substring(0, 2);
    var greenHex = hexString.substring(2, 4);
    var blueHex = hexString.substring(4, 6);
    var newRed = Math.floor((parseInt('0x' + redHex) * (1 / factor)));
    var newGreen = Math.floor((parseInt('0x' + greenHex) * (1 / factor)));
    var newBlue = Math.floor((parseInt('0x' + blueHex) * (1 / factor)));
    var newColor = '#'
            + newRed.toString(16).toUpperCase()
            + newGreen.toString(16).toUpperCase()
            + newBlue.toString(16).toUpperCase();
    return newColor;
}
