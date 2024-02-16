import { useState, useEffect } from "react";
import { validateForm } from "../utils/formUtils";

const useRecipeForm = (initialRecipe = null, isEditing = false) => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([{ ingredient: "", quantity: "", unit: "" }]);
  const [instructions, setInstructions] = useState([{ direction: "" }]);
  const [formErrors, setFormErrors] = useState({});
  const [recipeImage, setRecipeImage] = useState(null);

  // Populate state with recipe data if in editing mode
  useEffect(() => {
    if (isEditing && initialRecipe) {
      setTitle(initialRecipe.title);
      setIngredients(initialRecipe.ingredients || [{ ingredient: "", quantity: "", unit: "" }]);
      setInstructions(initialRecipe.instructions || [{ direction: "" }]);
      if (initialRecipe.image_url) {
        setRecipeImage(initialRecipe.image_url);
      }
    }
  }, [initialRecipe, isEditing]);

  const validateAndUpdateForm = () => {
    const { isValid, errors } = validateForm({ title, ingredients, instructions });
    setFormErrors(errors);
    return isValid;
  };
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleIngredientChange = (e, index) => {
    const { name, value } = e.target;
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [name]: value };
    setIngredients(updatedIngredients);
  };

  const handleUnitChange = (e, index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], unit: e.target.value };
    setIngredients(updatedIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredient: "", quantity: "", unit: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    const filteredIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(filteredIngredients);
  };

  const handleInstructionChange = (index, newDirection) => {
    const updatedInstructions = instructions.map((instruction, i) => (i === index ? { ...instruction, direction: newDirection } : instruction));
    setInstructions(updatedInstructions);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, { direction: "" }]);
  };

  const handleRemoveInstruction = (index) => {
    const filteredInstructions = instructions.filter((_, i) => i !== index);
    setInstructions(filteredInstructions);
  };

  return {
    title,
    setTitle,
    ingredients,
    setIngredients,
    instructions,
    setInstructions,
    formErrors,
    recipeImage,
    setRecipeImage,
    validateAndUpdateForm,
    handleTitleChange,
    handleIngredientChange,
    handleUnitChange,
    handleAddIngredient,
    handleRemoveIngredient,
    handleInstructionChange,
    handleAddInstruction,
    handleRemoveInstruction,
  };
};

export default useRecipeForm;
