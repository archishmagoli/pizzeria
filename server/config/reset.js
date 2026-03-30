import { pool } from "./database.js";
import './dotenv.js';

const createTableQuery = `
    DROP TABLE IF EXISTS pizzeria;

    CREATE TABLE IF NOT EXISTS pizzeria (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        customInstructions TEXT NOT NULL,
        details jsonb NOT NULL
    )
`

const createPizzeriaTable = async () => {
    try {
        const res = await pool.query(createTableQuery);
        console.log('🎉 pizzeria table created successfully');
    } catch (error) {
        console.error('⚠️ error creating pizzeria table', error)
    }
}

await createPizzeriaTable();