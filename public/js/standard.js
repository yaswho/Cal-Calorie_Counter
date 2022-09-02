const logout = function()
{
    var data = {};
    var request = new XMLHttpRequest();
    request.open('POST', '/api/logout', true);
    request.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded; charset=UTF-8'
      );
    request.send(data);
}

document.getElementById('logout').onclick = logout;