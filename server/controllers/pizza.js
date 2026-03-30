import { pool } from '../config/database.js';

const selectTableQuery = `
    SELECT * FROM pizzeria;
`;

const getPizzas = async (req, res) => {
    try {
        const results = await pool.query(selectTableQuery);
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(409).json( { error: error.message } );
    }
}

const getPizzaById = async (req, res) => {
    try {
        const { pizzaId } = req.params;
        const results = await pool.query('SELECT * FROM pizzeria WHERE id = $1', [pizzaId]);
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Pizza not found' });
        }
        res.status(200).json(results.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

const createPizza = async (req, res) => {
  try {
      const { name, customInstructions, details } = req.body
      const results = await pool.query(`
          INSERT INTO pizzeria (name, customInstructions, details)
          VALUES($1, $2, $3)
          RETURNING *`,
          [name, customInstructions, details]
      )

      res.status(201).json(results.rows[0])
  } catch (error) {
      res.status(409).json( { error: error.message } )
  }
}

const updatePizza = async (req, res) => {
    try {
        const pizzaId = parseInt(req.params.id)
        const { name, customInstructions, details } = req.body

        const results = await pool.query(`
            UPDATE pizzeria SET name = $1, customInstructions = $2, details = $3 WHERE id = $4`,
            [name, customInstructions, details, pizzaId]
        )

        res.status(200).json(results.rows[0])
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

const deletePizza = async (req, res) => {
    try {
        const { pizzaId } = req.params;
        const results = await pool.query('DELETE FROM pizzeria WHERE id = $1', [pizzaId]);
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Pizza not found' });
        }
        res.status(200).json("Pizza successfully deleted.");
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

export default {
    getPizzas,
    getPizzaById,
    deletePizza,
    updatePizza,
    createPizza
};