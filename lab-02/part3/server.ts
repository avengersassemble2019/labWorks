import * as fs from 'fs';
import * as http from 'node:http';
import { IncomingMessage, ServerResponse } from 'node:http';
import * as crypto from 'crypto';
import { pool, sendToDatabase } from './database'
import { generateLoanStatusHtml } from './part3'

const server = http.createServer(async (request: IncomingMessage, response: ServerResponse) => {
    const { method, url } = request;

    if (url === '/apply-loan') {

        const htmlContents = './ui.html';
        try {
            const contents = fs.readFileSync(htmlContents, 'utf-8');
            response
                .writeHead(200, { 'Content-Type': 'text/html' })
                .end(contents);
        } catch (error) {
            console.error('Error reading HTML file:', error);
            response
                .writeHead(500, { 'Content-Type': 'text/plain' })
                .end('Internal Server Error');
        }

    } else if (url === '/apply-loan-success' && method === 'POST') {
        // Your HTML response
        const html = /* html */ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
        </head>
        <body>
          Date and time right now: ${new Date().toLocaleString()}
        </body>
        </html>
      `;

        response.writeHead(200, { 'Content-Type': 'text/html' }).end(html);

        let body = '';
        request.on('data', (chunk) => {
            body += chunk.toString()
        });

        request.on('end', async () => {
            const formData = new URLSearchParams(body);
            const name = formData.get('name') || '';
            const email = formData.get('email') || '';
            const phone_number = formData.get('phone_number') || '';
            const loanAmount = formData.get('loan_amount') || '';
            const reason = formData.get('reason') || '';
            const loanAmountInt = parseInt(loanAmount);
            const phoneNumberInt = parseFloat(phone_number);
            const token = crypto.randomBytes(20).toString('base64url');

            try {
                const result = await sendToDatabase({
                    token,
                    name,
                    email,
                    phone_number: phoneNumberInt,
                    loan_amount: loanAmountInt,
                    reason,
                });
                if (result) {
                    console.log('Data inserted:', result.rows);
                }
            } catch (error) {
                console.error(error);
            }
        });

    } else if (url === '/loan-status' && method === 'GET') {

        const loanStatusHtml = /* html */ `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Loan Status</title>
      </head>
      <body>
        <form action='/loan-info' method='POST'>
        <h1>Loan Status</h1>
        token: <input  id= 'token' type='text' name='token'><button type='submit'>Search Loan</button>
        
      </body>
      </html>
    `;
        try {
            response.writeHead(200, { "Content-Type": "text/html" });
            response.end(loanStatusHtml);

        } catch (err) {
            response.writeHead(500, { "Error": err });
            response.end(err);
        }


    } else if (url === '/loan-info' && method === 'POST') {

        let body = '';
        request.on('data', (chunk) => {
            body += chunk.toString()
        });

        request.on('end', async () => {
            const inputData = new URLSearchParams(body);
            const token = inputData.get('token') || ''
            try {
                const client = await pool.connect();
                const result = await client.query(`SELECT * FROM loans WHERE token = '${token}'`);
                const data = result.rows
                const html = await generateLoanStatusHtml(data)
                response.writeHead(200, { 'Content-Type': 'text/html' })
                response.end(html)


            }
            catch (err) {
                console.error(err)
            }
        })
    }
})

server.listen(3000, () => {
    console.log('server is running at http://localhost:3000')
})