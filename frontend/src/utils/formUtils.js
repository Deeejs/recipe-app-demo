// Util func to check if an input is empty
const isEmpty = (value) => value.trim() === "";

// Func to validate individual ingredients
const validateIngredient = (ingredient) => {
  const errors = {};
  if (isEmpty(ingredient.ingredient)) errors.ingredient = "Ingredient name is required";
  if (isEmpty(ingredient.quantity)) errors.quantity = "Quantity is required";
  if (isEmpty(ingredient.unit)) errors.unit = "Unit is required";
  return errors;
};
const validateInstruction = (instruction) => {
  return isEmpty(instruction.direction) ? "Instruction is required" : "";
};
// Main validation function for the form
export const validateForm = ({ title, ingredients, instructions }) => {
  console.log("Title: ", title);
  let errors = { ingredients: [], instructions: [] };
  let isValid = true;

  // Validate title
  if (isEmpty(title)) {
    errors.title = "Title is required";
    isValid = false;
  }

  // Validate ingredients
  ingredients.forEach((ingredient, index) => {
    const ingredientErrors = validateIngredient(ingredient);
    if (Object.keys(ingredientErrors).length > 0) {
      errors.ingredients[index] = ingredientErrors;
      isValid = false;
    } else {
      errors.ingredients[index] = {};
    }
  });

  // Validate instructions
  instructions.forEach((instruction, index) => {
    const instructionError = validateInstruction(instruction);
    if (instructionError) {
      errors.instructions[index] = { direction: instructionError };
      isValid = false;
    } else {
      errors.instructions[index] = {};
    }
  });

  // Return both the validity of the form and the errors object
  return { isValid, errors };
};

// process the ingrendients due to the input type
// 1/2 -> 0.5 or 1 1/2 -> 1.5
export const processIngredientsForSubmission = (ingredients) => {
  return ingredients.map((ingredient) => {
    let { quantity } = ingredient;
    console.log("Quantity: Before", quantity);
    const decimalValue = parseInputToDecimal(quantity);
    quantity = decimalValue;

    return { ...ingredient, quantity };
  });
};

const parseInputToDecimal = (input) => {
  if (input.includes(" ")) {
    const [wholeNumber, fraction] = input.split(" ");
    return parseFloat(wholeNumber) + fractionToDecimal(fraction);
  } else if (input.includes("/")) {
    return fractionToDecimal(input);
  }
  return parseFloat(input);
};
const fractionToDecimal = (fraction) => {
  const [numerator, denominator] = fraction.split("/").map(Number);
  return numerator / denominator;
};
// add mock data to the form
export const mockData = {
  title: "Mock Recipe",
  ingredients: [
    { ingredient: "Flour", quantity: "1 1/2", unit: "Cup" },
    { ingredient: "Sugar", quantity: "1/2", unit: "Cup" },
    { ingredient: "Egg", quantity: "2", unit: "" },
    { ingredient: "Milk", quantity: "1", unit: "Cup" },
  ],
  instructions: [
    { direction: "Preheat oven to 350 degrees F (175 degrees C)." },
    { direction: "Grease and flour a 9x9 inch pan or line a muffin pan with paper liners." },
    { direction: "In a medium bowl, cream together the sugar and butter." },
    { direction: "Beat in the eggs, one at a time, then stir in the vanilla." },
  ],
};
