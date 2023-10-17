
import { pool } from './database';


export async function generateLoanStatusHtml(loanData: any[]) {
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

