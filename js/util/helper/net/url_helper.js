// from http://stackoverflow.com/questions/979975/
var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();

var songName = QueryString.song;
if (songName !== undefined) {
    songName = decodeURIComponent(songName);
}
var subgenreName = QueryString.subgenre;
if (subgenreName !== undefined) {
    subgenreName = decodeURIComponent(subgenreName);
} else {
    var genreName = QueryString.genre;
    if (genreName !== undefined) {
        genreName = decodeURIComponent(genreName);
        if (genreName == 'DnB') {
            genreName = 'Drum & Bass';
        }
    }
}
var artistName = QueryString.artist;
if (artistName !== undefined) {
    artistName = decodeURIComponent(artistName);
}
