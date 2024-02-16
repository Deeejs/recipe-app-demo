import React from "react";
import RecipeGallery from "../components/RecipeGallery";
import { Typography, Box } from "@mui/material";
import KitchenIcon from "@mui/icons-material/Kitchen"; // Importing a specific icon

function ViewAllRecipes() {
  console.log("Rendering view all recipes page...");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2, // Padding around the content
      }}
    >
      <Typography variant='h4' component='h2' sx={{ textAlign: "center", display: "flex", alignItems: "center", gap: 1, p: 2 }}>
        <KitchenIcon /> View All Recipes Page
      </Typography>
      <RecipeGallery />
    </Box>
  );
}

export default ViewAllRecipes;
