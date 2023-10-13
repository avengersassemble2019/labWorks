"use strict";
exports.__esModule = true;
// a function in node called require that loads modules
var http = require('http');
function handleRequest(request, response) {
    var url = request.url;
    var method = request.method;
    console.log('Debugging -- url is', url, 'while method is', method);
    // asynchronous operation fetching data from a database
    setTimeout(function () {
        response.writeHead(200, { 'Content-Type': 'text/plain' }); // response headers
        response.end('Basilio sent me here to tell you hi' + url); // response will be in the body
    }, 1000);
    // 200 tells the browser the response is successful, memorize the common ones: 200, 401, 403, 404, 500 important
}
var server = http.createServer(handleRequest);
var hostname = '127.0.0.1'; // localhost
var port = 3000;
server.listen(port, hostname, function () {
    console.log("Server started at http://".concat(hostname, ":").concat(port, "/"));
});
