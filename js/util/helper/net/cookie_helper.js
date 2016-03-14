function getCookie(c_name){
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1){
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1){
        c_value = null;
    }
    else {
        c_start = c_value.indexOf("=", c_start)+ 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1){
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
}

function setCookie(c_name, value) {
    document.cookie = c_name + '=' + value + '; expires=' + new Date(2037, 0, 1, 0, 0, 0, 0).toGMTString() + '; path=/';
}
