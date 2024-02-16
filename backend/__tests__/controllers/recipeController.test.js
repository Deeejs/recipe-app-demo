const { postRecipe, getAllRecipes, getRecipeById, editRecipeById, deleteRecipeById } = require("../../controller/recipes-controller");

// Mock the db_config module
jest.mock("../../config/db_config", () => ({
  query: jest.fn().mockResolvedValue({ rows: [{ id: 1 }], rowCount: 1 }),
}));

// Mock the multer module
jest.mock("multer", () => {
  return jest.fn().mockReturnValue({
    single: () =>
      jest.fn((req, res, next) => {
        req.file = { buffer: "fakeImageBuffer" }; // Mock file buffer
        next();
      }),
  });
});

describe("postRecipe function", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    require("../../config/db_config").query.mockClear();
  });

  it("should insert recipe data into the database successfully", async () => {
    const req = {
      body: {
        title: "Test Recipe",
        ingredients: JSON.stringify([{ ingredient: "Test Ingredient", quantity: 1, unit: "Test Unit" }]),
        instructions: JSON.stringify([{ direction: "Test Instruction" }]),
      },
      file: {
        buffer: Buffer.from("fakeImageData"),
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await postRecipe(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });

  it("should return a 400 error if required data is missing", async () => {
    const req = {
      body: {
        title: "Test Recipe",
        ingredients: JSON.stringify([]),
        instructions: JSON.stringify([]),
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await postRecipe(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Must provide a title, ingredients, and instructions lists" });
  });
});
describe("getAllRecipes function", () => {
  it("should fetch all recipes successfully", async () => {
    // Mocking database response
    require("../../config/db_config").query.mockResolvedValueOnce({
      rows: [
        { id: 1, title: "Recipe 1", image_data: Buffer.from("imageData1") },
        { id: 2, title: "Recipe 2", image_data: Buffer.from("imageData2") },
      ],
    });
    const req = {}; // Empty since no input is needed
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await getAllRecipes(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });
});
describe("getRecipeById function", () => {
  it("should fetch a specific recipe by ID successfully", async () => {
    // Mocking database response for the recipe, ingredients, and instructions
    require("../../config/db_config")
      .query.mockResolvedValueOnce({
        rows: [{ id: 1, title: "Recipe 1", image_data: Buffer.from("imageData1") }],
      })
      .mockResolvedValueOnce({
        // Mock for ingredients
        rows: [{ ingredient: "Ingredient 1", quantity: 1, unit: "Unit" }],
      })
      .mockResolvedValueOnce({
        // Mock for instructions
        rows: [{ step_number: 1, direction: "Step 1" }],
      });

    const req = { params: { id: "1" } };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await getRecipeById(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });
});
describe("editRecipeById function", () => {
  it("should update a recipe successfully", async () => {
    const req = {
      params: { id: "1" },
      body: {
        title: "Updated Recipe",
        ingredients: JSON.stringify([{ ingredient: "New Ingredient", quantity: 1, unit: "New Unit" }]),
        instructions: JSON.stringify([{ direction: "New Direction" }]),
      },
      file: { buffer: Buffer.from("newImageData") }, // Simulate image file upload
    };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await editRecipeById(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.any(Object));
  });
});
describe("editRecipeById function error handling", () => {
  it("should handle database errors by rolling back transaction", async () => {
    // Simulate a database error during the update process
    require("../../config/db_config").query.mockRejectedValueOnce(new Error("Database error"));

    const req = {
      params: { id: "1" },
      body: {
        title: "Updated Recipe",
        ingredients: JSON.stringify([{ ingredient: "New Ingredient", quantity: 1, unit: "New Unit" }]),
        instructions: JSON.stringify([{ direction: "New Direction" }]),
      },
    };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await editRecipeById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to edit the recipe" });
    // Verify that a rollback was attempted after the error
    expect(require("../../config/db_config").query.mock.calls.some((call) => call[0].toUpperCase() === "ROLLBACK")).toBeTruthy();
  });
});

describe("deleteRecipeById function", () => {
  it("should delete a recipe successfully", async () => {
    // Mocking successful deletion
    require("../../config/db_config").query.mockResolvedValueOnce({ rowCount: 1 });

    const req = { params: { id: "1" } };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await deleteRecipeById(req, res);

    expect(res.json).toHaveBeenCalledWith("Recipe was deleted");
  });
});
