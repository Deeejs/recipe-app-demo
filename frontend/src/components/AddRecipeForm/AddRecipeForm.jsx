import React from "react";
import { Button, TextField, IconButton, Container, Grid, Paper, Typography, Box } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ImageUpload from "./ImageUpload";
import IngredientInput from "./IngredientInput";
import InstructionInput from "./InstructionInput";
import useRecipeForm from "../../hooks/useRecipeForm";
import useRecipeAPI from "../../hooks/useRecipeAPI";
import { processIngredientsForSubmission } from "../../utils/formUtils";
const AddRecipeForm = ({ recipe, handleCloseDialog, isEditing }) => {
  const {
    title,
    setTitle,
    ingredients,
    instructions,
    formErrors,
    recipeImage,
    setRecipeImage,
    validateAndUpdateForm,
    handleAddIngredient,
    handleRemoveIngredient,
    handleIngredientChange,
    handleUnitChange,
    handleAddInstruction,
    handleRemoveInstruction,
    handleInstructionChange,
  } = useRecipeForm(recipe, isEditing);

  const { createRecipe, updateRecipe } = useRecipeAPI();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateAndUpdateForm()) {
      console.log("Validation failed.");
      return;
    }

    const processedIngredients = processIngredientsForSubmission(ingredients);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("ingredients", JSON.stringify(processedIngredients));
    formData.append("instructions", JSON.stringify(instructions));
    if (recipeImage) {
      formData.append("file", recipeImage);
    }

    try {
      const result = isEditing ? await updateRecipe(recipe.id, formData) : await createRecipe(formData);
      console.log("Recipe saved successfully:", result);
      if (isEditing) {
        //close the dialog
        handleCloseDialog();
      }
      if (result) {
        alert("Recipe added successfully");
        // Reload the page or redirect to the recipe detail page
        window.location = `/recipe/${result.id}`;
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      // Handle API error
    }
  };

  return (
    <Container component='main' maxWidth='md'>
      <Paper elevation={6} sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component='h1' variant='h5' align='center'>
          {isEditing ? "Edit Recipe" : "Add New Recipe"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ImageUpload image={recipeImage} onImageUpload={setRecipeImage} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Title'
                name='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!formErrors.title}
                helperText={formErrors.title || ""}
              />
            </Grid>

            {/* Ingredients Inputs */}
            <Grid item xs={12}>
              <Typography variant='h6'>Ingredients</Typography>
              {ingredients.map((ingredient, index) => (
                <IngredientInput
                  key={index}
                  ingredient={ingredient}
                  index={index}
                  onIngredientChange={handleIngredientChange}
                  onUnitChange={handleUnitChange}
                  onRemove={() => handleRemoveIngredient(index)}
                  canRemove={ingredients.length > 1}
                  formErrors={formErrors}
                />
              ))}
              <IconButton onClick={handleAddIngredient}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Grid>

            {/* Instructions Inputs */}
            <Grid item xs={12}>
              <Typography variant='h6'>Instructions</Typography>
              {instructions.map((instruction, index) => (
                <InstructionInput
                  key={index}
                  instruction={instruction}
                  index={index}
                  onInstructionChange={(e) => handleInstructionChange(index, e.target.value)}
                  onRemove={() => handleRemoveInstruction(index)}
                  canRemove={instructions.length > 1}
                  formErrors={formErrors}
                />
              ))}
              <IconButton onClick={handleAddInstruction}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
              {isEditing && (
                <Button variant='contained' color='secondary' onClick={handleCloseDialog}>
                  Cancel
                </Button>
              )}
              <Box sx={{ flexGrow: 1 }} /> {/* This box pushes all items to the edges */}
              <Button variant='contained' color='primary' type='submit'>
                {isEditing ? "Update Recipe" : "Add Recipe"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddRecipeForm;
