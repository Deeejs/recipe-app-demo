import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IconButton, Container, Typography, Card, CardMedia, CardContent, Stack, Chip, Dialog, DialogContent, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddRecipeForm from "./AddRecipeForm/AddRecipeForm";
import DeleteIcon from "@mui/icons-material/Delete";
import useRecipeAPI from "../hooks/useRecipeAPI";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { fetchRecipeById, deleteRecipe } = useRecipeAPI();

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const recipeData = await fetchRecipeById(id);
        // mock data for calories, serving size, and prep time
        recipeData.calories = Math.floor(Math.random() * 1000); // Random calories
        recipeData.serving_size = Math.floor(Math.random() * 10) + 1;
        recipeData.prep_time = Math.floor(Math.random() * 60) + 15;
        setRecipe(recipeData);
      } catch (err) {
        console.error("Error fetching recipe details:", err);
      }
    };

    loadRecipe();
    // eslint-disable-next-line
  }, [id]);
  // Simple loading message while fetching recipe data
  if (!recipe) return <Typography>Loading...</Typography>;
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleDeleteRecipe = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        // Use the deleteRecipe method from the hook
        await deleteRecipe(id);
        alert("Recipe deleted successfully");
        window.location = "/"; // Redirect to the home page or list of recipes
      } catch (err) {
        console.error("Error deleting recipe:", err);
        alert("Failed to delete the recipe");
      }
    }
  };

  return (
    <Container maxWidth='md'>
      <Box sx={{ my: 4, borderColor: "blue" }}>
        <Typography variant='h3' gutterBottom component='h1'>
          {recipe.title}
          <IconButton aria-label='edit' onClick={handleOpenDialog} sx={{ float: "right" }}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label='delete' onClick={handleDeleteRecipe} sx={{ ml: 1, float: "right" }}>
            <DeleteIcon />
          </IconButton>
        </Typography>
        <Card>
          <CardMedia
            component='img'
            height='300'
            // Use the base64 image if available, otherwise fallback to a placeholder image
            image={recipe.image_url ? recipe.image_url : `https://source.unsplash.com/1600x900/?${recipe.title}`}
            alt={recipe.title}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              Details
            </Typography>
            {/* Additional recipe details and rendering */}
            <Typography variant='body1' color='text.secondary' gutterBottom>
              Calories: {recipe.calories} kcal
            </Typography>
            <Typography variant='body1' color='text.secondary' gutterBottom>
              Serving Size: {recipe.serving_size}
            </Typography>
            <Typography variant='body1' color='text.secondary' gutterBottom>
              Prep Time: {recipe.prep_time} minutes
            </Typography>
            <Typography variant='h6' gutterBottom>
              Ingredients
            </Typography>
            <Stack direction='row' spacing={1} flexWrap='wrap'>
              {recipe.ingredients &&
                recipe.ingredients.map((ingredient, index) => (
                  <Chip key={index} label={`${ingredient.ingredient}: ${ingredient.quantity} ${ingredient.unit}`} variant='outlined' />
                ))}
            </Stack>
            <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
              Instructions
            </Typography>
            {recipe.instructions &&
              recipe.instructions.map((instruction, index) => (
                <Typography key={index} paragraph>
                  {instruction.step_number}. {instruction.direction}
                </Typography>
              ))}
          </CardContent>
        </Card>
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='md' fullWidth>
          <DialogContent sx={{ p: 0 }}>
            <AddRecipeForm recipe={recipe} handleCloseDialog={handleCloseDialog} isEditing={true} />
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
};

export default RecipeDetail;
