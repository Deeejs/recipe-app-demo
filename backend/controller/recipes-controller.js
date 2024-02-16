const axios = require("axios");
const pool = require("../config/db_config");
const multer = require("multer");

//create utility to convert binary image data to base64 string
const convertImageToBase64 = (imageData) => {
  if (imageData) {
    const imageBase64String = Buffer.from(imageData).toString("base64");
    return `data:image/jpeg;base64,${imageBase64String}`;
  }
  return null;
};

const postRecipe = async (req, res) => {
  const { title } = req.body;
  const ingredients = JSON.parse(req.body.ingredients);
  const instructions = JSON.parse(req.body.instructions);
  const imageFile = req.file;

  // Basic validation
  if (!title || !ingredients.length || !instructions.length) {
    return res.status(400).json({ error: "Must provide a title, ingredients, and instructions lists" });
  }

  try {
    //Start a transaction
    await pool.query("BEGIN");

    let imageData = null;
    if (imageFile) {
      imageData = imageFile.buffer; // Directly use the buffer for binary storage
    }

    // Insert the recipe and get its ID
    const recipeResult = await pool.query("INSERT INTO recipes (title, image_data) VALUES ($1, $2) RETURNING *", [title, imageData]);
    const recipeId = recipeResult.rows[0].id;
    console.log("recipeResult:", recipeResult);
    console.log("recipeId:", recipeId);
    // Insert ingredients
    for (const ingredient of ingredients) {
      await pool.query("INSERT INTO ingredients (recipe_id, ingredient, quantity, unit) VALUES ($1, $2, $3, $4)", [
        recipeId,
        ingredient.ingredient,
        ingredient.quantity,
        ingredient.unit,
      ]);
    }

    // Insert instructions
    let stepNumber = 1; // Initialize step number if it's not part of your data
    for (const instruction of instructions) {
      await pool.query("INSERT INTO instructions (recipe_id, step_number, direction) VALUES ($1, $2, $3)", [
        recipeId,
        stepNumber++,
        instruction.direction,
      ]);
    }

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(201).json(recipeResult.rows[0]);
  } catch (err) {
    // Rollback transaction on error
    await pool.query("ROLLBACK");
    console.error("Failed to add the recipe:", err.message);
    res.status(500).json({ error: "Failed to add the recipe" });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    // Fetch all recipes
    const recipesResult = await pool.query("SELECT * FROM recipes ORDER BY id ASC");
    let recipes = recipesResult.rows;

    // Convert each recipe's image data to a base64 string
    recipes = recipes.map((recipe) => {
      if (recipe.image_data) {
        // convert binary image data to base64 string
        const imageBase64String = Buffer.from(recipe.image_data).toString("base64");
        recipe.image_url = `data:image/jpeg;base64,${imageBase64String}`; // Adjust the MIME type accordingly
        delete recipe.image_data; // Optionally remove the binary data from the response object
      }

      return recipe;
    });
    // Ideally, optimize to reduce the number of queries
    for (let recipe of recipes) {
      // Fetch ingredients
      const ingredientsResult = await pool.query("SELECT ingredient, quantity, unit FROM ingredients WHERE recipe_id = $1", [recipe.id]);
      recipe.ingredients = ingredientsResult.rows;

      // Fetch instructions
      const instructionsResult = await pool.query("SELECT step_number, direction FROM instructions WHERE recipe_id = $1", [recipe.id]);
      recipe.instructions = instructionsResult.rows;
    }

    res.json(recipes);
  } catch (err) {
    console.error("Failed to retrieve recipes", err.message);
    res.status(500).json({ error: "Server error Failed to retrieve recipes" });
  }
};

const getRecipeById = async (req, res) => {
  console.log("Running getRecipeById");

  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid recipe ID" });
  }

  try {
    // Fetch the recipe along with the image data
    const recipeResult = await pool.query("SELECT * FROM recipes WHERE id = $1", [id]);
    if (recipeResult.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    let recipe = recipeResult.rows[0];

    // Convert the binary image data to a Base64 string if the image data exists
    if (recipe.image_data) {
      // Ensure the binary data is correctly handled, assuming it's stored in a Buffer-compatible format
      const imageBase64String = Buffer.from(recipe.image_data).toString("base64");
      recipe.image_url = `data:image/jpeg;base64,${imageBase64String}`; // Adjust the MIME type accordingly
      delete recipe.image_data; // Optionally remove the binary data from the response object
    }

    // Fetch ingredients
    const ingredientsResult = await pool.query("SELECT ingredient, quantity, unit FROM ingredients WHERE recipe_id = $1", [id]);
    recipe.ingredients = ingredientsResult.rows;

    // Fetch instructions
    const instructionsResult = await pool.query("SELECT step_number, direction FROM instructions WHERE recipe_id = $1", [id]);
    recipe.instructions = instructionsResult.rows;

    // Respond with the recipe, including the base64-encoded image
    res.json(recipe);
  } catch (err) {
    console.error("Failed to retrieve recipe", err.message);
    res.status(500).json({ error: "Server error Failed to retrieve the recipe" });
  }
};

const editRecipeById = async (req, res) => {
  console.log("Running editRecipeById");
  console.log("Request body:", req.body);
  const { id } = req.params;
  const { title } = req.body;
  const ingredients = JSON.parse(req.body.ingredients);
  const instructions = JSON.parse(req.body.instructions);
  const imageFile = req.file; // Using Multer for file upload handling

  // Basic validation
  if (!title || !ingredients.length || !instructions.length) {
    return res.status(400).json({ error: "Must provide a title, ingredients, and instructions lists" });
  }
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ error: "Invalid recipe ID" });
  }

  try {
    // Start a transaction
    await pool.query("BEGIN");

    let updateRecipeQuery = "UPDATE recipes SET title = $1 WHERE id = $2";
    let queryValues = [title, id];

    // If there's an image file, prepare query and values for image update
    if (imageFile) {
      updateRecipeQuery = "UPDATE recipes SET title = $1, image_data = $2 WHERE id = $3";
      queryValues = [title, imageFile.buffer, id]; // Use the buffer for binary storage
    }

    // Update the recipe's title, and image if provided
    await pool.query(updateRecipeQuery, queryValues);

    // Delete existing ingredients and instructions for the recipe
    await pool.query("DELETE FROM ingredients WHERE recipe_id = $1", [id]);
    await pool.query("DELETE FROM instructions WHERE recipe_id = $1", [id]);

    // Insert new ingredients
    for (const ingredient of ingredients) {
      await pool.query("INSERT INTO ingredients (recipe_id, ingredient, quantity, unit) VALUES ($1, $2, $3, $4)", [
        id,
        ingredient.ingredient,
        ingredient.quantity,
        ingredient.unit,
      ]);
    }

    // Insert new instructions
    instructions.forEach((instruction, index) => {
      instruction.step_number = index + 1; // Ensure correct step numbering
    });
    for (const instruction of instructions) {
      await pool.query("INSERT INTO instructions (recipe_id, step_number, direction) VALUES ($1, $2, $3)", [
        id,
        instruction.step_number,
        instruction.direction,
      ]);
    }

    // Commit the transaction
    await pool.query("COMMIT");

    // Fetch the updated recipe to return
    const updatedRecipe = await pool.query("SELECT * FROM recipes WHERE id = $1", [id]);
    if (updatedRecipe.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(updatedRecipe.rows[0]);
  } catch (err) {
    // Rollback the transaction in case of an error
    await pool.query("ROLLBACK");
    console.error("Failed to edit recipe", err.message);
    res.status(500).json({ error: "Failed to edit the recipe" });
  }
};

const deleteRecipeById = async (req, res) => {
  console.log("Running deleteRecipeById");
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM recipes WHERE id = $1", [id]);
    res.json("Recipe was deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to delete the recipe" });
  }
};

module.exports = {
  postRecipe,
  getAllRecipes,
  getRecipeById,
  editRecipeById,
  deleteRecipeById,
};
