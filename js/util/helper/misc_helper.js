var resRatio = $(window).width() / 1920;

function selectiveToUpperCase(str) {
    str = str.toUpperCase();
    var i;
    while ((i = str.indexOf('^')) !== -1) {
        str = str.replace(str.substring(i, i + 2), str.substring(i + 1, i + 2).toLowerCase());
    }
    return str;
}

function onError(e) {
    console.log(e);
}
