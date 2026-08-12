const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// I-add ang function para mag-insert ng household_id
const createUser = async (name, email, age, household_id, purok_name, relationship_to_head, contact_number, occupation) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, age, household_id, purok_name, relationship_to_head, contact_number, occupation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [name, email, age, household_id, purok_name, relationship_to_head, contact_number, occupation]
  );
  return result.rows[0];
};