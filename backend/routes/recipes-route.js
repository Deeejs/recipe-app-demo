const express = require("express");
const recipesRoutes = express.Router();
const multer = require("multer");
const { postRecipe, getAllRecipes, getRecipeById, editRecipeById, deleteRecipeById } = require("../controller/recipes-controller");
const storage = multer.memoryStorage(); // Using memory storage for simplicity
const upload = multer({ storage: storage }); // Configure multer with memory storage
// Add a new recipe
recipesRoutes.post("/recipes", upload.single("file"), postRecipe);
// Get all recipes
recipesRoutes.get("/recipes", getAllRecipes);
// Get recipe by ID
recipesRoutes.get("/recipes/:id", getRecipeById);
// Edit recipe by ID
recipesRoutes.put("/recipes/:id", upload.single("file"), editRecipeById);
// Delete recipe by ID
recipesRoutes.delete("/recipes/:id", deleteRecipeById);

module.exports = recipesRoutes;
