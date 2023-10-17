import { Pool, QueryResult } from 'pg';

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'labs',
    password: 'BASILA2001',
    port: 5432,
});

export async function sendToDatabase(formData: {
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
