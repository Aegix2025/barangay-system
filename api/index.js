const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ======================== SUPABASE DATABASE CONNECTION ========================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// ======================== ROUTES ========================

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, age, household_id, purok_name, relationship_to_head, contact_number, occupation, created_at FROM users ORDER BY id'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single user
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, name, email, age, household_id, purok_name, relationship_to_head, contact_number, occupation, created_at FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create user
app.post('/api/users', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      age, 
      household_id, 
      purok_name, 
      relationship_to_head, 
      contact_number, 
      occupation 
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO users 
       (name, email, age, household_id, purok_name, relationship_to_head, contact_number, occupation) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, name, email, age, household_id, purok_name, relationship_to_head, contact_number, occupation, created_at`,
      [name, email, age, household_id, purok_name, relationship_to_head, contact_number, occupation]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      email, 
      age, 
      household_id, 
      purok_name, 
      relationship_to_head, 
      contact_number, 
      occupation 
    } = req.body;
    
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, age = $3, household_id = $4, purok_name = $5, relationship_to_head = $6, contact_number = $7, occupation = $8 
       WHERE id = $9 
       RETURNING id, name, email, age, household_id, purok_name, relationship_to_head, contact_number, occupation, created_at`,
      [name, email, age, household_id, purok_name, relationship_to_head, contact_number, occupation, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Node.js + Supabase API is running!',
    endpoints: {
      users: '/api/users'
    }
  });
});

const PORT = process.env.PORT || 5000;

// Start server (for local development)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;