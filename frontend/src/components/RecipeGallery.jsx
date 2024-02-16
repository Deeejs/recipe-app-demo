import React, { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, Grid, Container, Chip, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useRecipeAPI from "../hooks/useRecipeAPI";

function RecipeGallery() {
  const [recipes, setRecipes] = useState([]);
  const { fetchRecipes } = useRecipeAPI(); // Destructure fetchRecipes from the custom hook

  const navigate = useNavigate();
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const recipesData = await fetchRecipes();
        // mock data for calories, serving size, and prep time
        recipesData.forEach((recipe) => {
          recipe.calories = Math.floor(Math.random() * 1000);
          recipe.serving_size = Math.floor(Math.random() * 10) + 1;
          recipe.prep_time = Math.floor(Math.random() * 60) + 15;
        });
        setRecipes(recipesData);
      } catch (err) {
        alert("There was an error retrieving the recipe data");
        console.log("There was an error retrieving the recipe data:", err);
      }
    };

    loadRecipes();
    // eslint-disable-next-line
  }, []);
  const handleCardClick = (id) => {
    navigate(`/recipe/${id}`);
  };
  return (
    <Container>
      <Grid container spacing={4}>
        {recipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id} onClick={() => handleCardClick(recipe.id)}>
            <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <CardMedia
                component='img'
                height='140'
                image={recipe.image_url ? recipe.image_url : `https://source.unsplash.com/1600x900/?${recipe.title}`} // Use the base64 image if available, otherwise fallback to a placeholder image
                alt={recipe.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant='h5' component='div'>
                  {recipe.title}
                </Typography>
                {/* Display calories, serving size, and prep time if available */}
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  {`Cals: ${recipe.calories}, Srv. Size: ${recipe.serving_size}, Prep: ${recipe.prep_time} mins`}
                </Typography>
                <Typography variant='body2' color='text.primary' component='div'>
                  Ingredients
                </Typography>
                <Stack direction='row' flexWrap='wrap' gap={1} mt={1}>
                  {recipe.ingredients.map((item, index) => (
                    <Chip key={index} label={`${item.ingredient}`} variant='outlined' />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default RecipeGallery;
