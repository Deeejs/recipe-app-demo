import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// import { Amplify } from "aws-amplify";
// import { Authenticator } from "@aws-amplify/ui-react";
// import awsExports from "./aws-exports";
// import "@aws-amplify/ui-react/styles.css";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";

import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import AddRecipePage from "./pages/AddRecipePage";
import ViewAllRecipes from "./pages/ViewAllRecipes";
import NotFoundPage from "./pages/NotFoundPage";
// Amplify.configure(awsExports);

function App() {
  return (
    // <Authenticator loginMechanisms={["email"]}>
    <Router>
      <CssBaseline />
      <AppBar position='static' component='nav'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Recipe App
          </Typography>
          <Button color='inherit' component={Link} to='/'>
            View All Recipes
          </Button>
          <Button color='inherit' component={Link} to='/add-recipe'>
            Add a Recipe
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path='/' element={<ViewAllRecipes />} />
        <Route path='/add-recipe' element={<AddRecipePage />} />
        <Route path='/recipe/:id' element={<RecipeDetailsPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Router>
    // </Authenticator>
  );
}

export default App;
