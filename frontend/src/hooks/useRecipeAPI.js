import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const useRecipeAPI = () => {
  const createRecipe = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/recipes`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      alert("Failed to add the recipe");
      console.error("Error submitting recipe:", error);
    }
  };

  const updateRecipe = async (id, formData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/recipes/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      alert("Failed to add the recipe");
      console.error("Error submitting recipe:", error);
    }
  };
  const deleteRecipe = async (id) => {
    try {
      console.log("Deleting recipe with id:", id);
      console.log("API_BASE_URL:", API_BASE_URL);
      await axios.delete(`${API_BASE_URL}/recipes/${id}`);
    } catch (error) {
      throw error;
    }
  };
  const fetchRecipeById = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes/${id}`);
      return response.data; // Return the recipe details
    } catch (error) {
      throw error; // Let the calling component handle the error
    }
  };
  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { createRecipe, updateRecipe, deleteRecipe, fetchRecipes, fetchRecipeById };
};

export default useRecipeAPI;
