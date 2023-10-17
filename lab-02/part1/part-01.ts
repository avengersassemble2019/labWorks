// a function in node called require that loads modules
let http = require('http');
import { IncomingMessage, ServerResponse } from 'node:http';

function handleRequest(request: IncomingMessage, response: ServerResponse) {
  let url = request.url;
  let method = request.method;

  console.log('Debugging -- url is', url, 'while method is', method);

  // asynchronous operation fetching data from a database
  setTimeout(() => {
    response.writeHead(200, { 'Content-Type': 'text/plain' }); // response headers
    response.end('Basilio sent me here to tell you hi' + url); // response will be in the body
  }, 1000);
  // 200 tells the browser the response is successful, memorize the common ones: 200, 401, 403, 404, 500 important
}

const server = http.createServer(handleRequest);

const hostname = '127.0.0.1'; // localhost
const port = 3000;

server.listen(port, hostname, () => {
  console.log(`Server started at http://${hostname}:${port}/`);
});

