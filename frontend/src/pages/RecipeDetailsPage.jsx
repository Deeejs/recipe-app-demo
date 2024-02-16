import React from "react";
import RecipeDetail from "../components/RecipeDetail";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const RecipeDetailsPage = () => {
  console.log("Rendering RecipeDetailsPage");

  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginTop={4}>
      <Typography variant='h4' component='h2' gutterBottom>
        Recipe Details
      </Typography>
      <RecipeDetail />
    </Box>
  );
};

export default RecipeDetailsPage;
