const express = require("express");
const app = express();
const cors = require("cors");
require("./config/db_config"); // Ensures the database setup script runs

const recipesRoutes = require("./routes/recipes-route");

app.use(express.json()); // Middleware for parsing JSON bodies
const PORT = process.env.PORT || 4000; // Declare PORT only once

// Enable CORS for the frontend
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// Use the recipesRoutes for all requests to /api
app.use("/api", recipesRoutes);

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
