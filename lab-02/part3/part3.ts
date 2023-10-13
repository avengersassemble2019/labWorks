import * as fs from 'fs';
import * as http from 'node:http';
import { IncomingMessage, ServerResponse } from 'node:http';
import { Pool, QueryResult } from 'pg';
import * as crypto from 'crypto'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'labs',
  password: 'BASILA2001',
  port: 5432,
});

async function sendToDatabase(formData: {
  name: string;
  email: string;
  phone_number: number;
  loan_amount: number;
  reason: string;
  token: string;

}): Promise<QueryResult> {
  const query = `
  INSERT INTO loans (name, email, phone_number, loan_amount, reason, token)
  VALUES ($1, $2, $3, $4, $5, $6)

  RETURNING *
`;
  const values = [formData.name, formData.email, formData.phone_number, formData.loan_amount, formData.reason, formData.token];
  try {
    let client = await pool.connect();
    const result = client.query(query, values)
    console.log('Data sent to db');
    return result
  } catch (err) {
    console.log('Error connecting to the database:', err);
    throw err;
  }
}

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
});
;
// DONT TOUCH TIS CODE
function generateLoanStatusHtml(loanData: any[]) {
  const loanStatusHtml = /* html */ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Loan Status</title>
    </head>
    <body>
      <h1>Loan Status</h1>
      Loan status: <input type="text" name="loan_amount"><button type="submit">Search Loan</button>
      <ul>
        <li>${loanData.map((loan) => `
          <li> Name: ${loan.name}</li> 
          <li> Email: ${loan.email} </li> 
          <li> Phone: ${loan.phone_number}</li> 
          <li> Amount: ${loan.loan_amount} </li> 
          <li> Reason: ${loan.reason}</li> 
          <li> token: ${loan.token}</li> 
          <li> Date and time right now: ${new Date().toLocaleString()}</li> 
          <li> </li>
        `).join(' ')}
      </ul>
    </body>
    </html>
  `;
  return loanStatusHtml;
}

async function fetchLoanDataFromDatabase(): Promise<any[]> {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM loans'; // Modify this query as needed
    const result = await client.query(query);
    client.release();
    return result.rows;
  } catch (error) {
    console.error('Error fetching loan data:', error);
    throw error;
  }
}


server.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});