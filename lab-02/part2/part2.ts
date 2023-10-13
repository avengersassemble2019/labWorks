import * as fs from 'fs';
import * as http from 'node:http';
import { IncomingMessage, ServerResponse } from 'node:http';

async function handleRequest(request: IncomingMessage, response:ServerResponse) {
  let url = request.url;
  let method = request.method;
  
  console.log('Debugging -- url is', url, 'while method is', method);

  if (url === '/apply-loan') { 
     let htmlContents = './ui.html';
    try {
      const contents = fs.readFileSync(htmlContents, 'utf-8')
      response
        .writeHead(200, { 'Content-Type': 'text/html' })
        .end(contents); // Send the contents as the response
    } catch (error) {
      console.error('Error reading HTML file:', error);
      response
        .writeHead(500, { 'Content-Type': 'text/plain' })
        .end('Internal Server Error');
    }
  } else {
    response
      .writeHead(200)
      .end('You sent me:' + url);
  }
   
}

const server = http.createServer(handleRequest);

server.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});