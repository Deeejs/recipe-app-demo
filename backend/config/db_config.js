const { Pool } = require("pg");
require("dotenv").config();

// Create a new pool using the connection details from the .env file
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
// The createTables function creates the recipes, ingredients, and instructions tables if they don't already exist
const createTables = async () => {
  const createRecipesTableQuery = `
    CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image_data BYTEA, -- For storing binary image data
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createIngredientsTableQuery = `
    CREATE TABLE IF NOT EXISTS ingredients (
        id SERIAL PRIMARY KEY,
        recipe_id INTEGER NOT NULL,
        ingredient VARCHAR(255) NOT NULL,
        quantity DECIMAL NOT NULL,
        unit VARCHAR(50),
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );
  `;

  const createInstructionsTableQuery = `
    CREATE TABLE IF NOT EXISTS instructions (
        id SERIAL PRIMARY KEY,
        recipe_id INTEGER NOT NULL,
        step_number INTEGER NOT NULL,
        direction TEXT NOT NULL,
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );
  `;

  try {
    await pool.query(createRecipesTableQuery);
    await pool.query(createIngredientsTableQuery);
    await pool.query(createInstructionsTableQuery);
    console.log("All tables created or already exist");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

// Immediately invoking the function to ensure tables are created on startup
createTables();

module.exports = pool;
