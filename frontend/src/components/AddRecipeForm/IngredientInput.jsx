import React from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import QuantityInput from "./QuantityInput";
// Ingredient Input component for adding a new recipe
const IngredientInput = ({ ingredient, index, onIngredientChange, onUnitChange, onRemove, canRemove, formErrors }) => {
  const units = ["Cup", "Tablespoon", "Teaspoon", "Gram", "Ounce", "Milliliter", "Liter"];
  const handleQuantityChange = (newValue) => {
    onIngredientChange({ target: { name: "quantity", value: newValue } }, index);
  };

  return (
    <Grid container spacing={1} alignItems='flex-end' style={{ marginBottom: "20px" }}>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label='Ingredient'
          name='ingredient'
          value={ingredient.ingredient}
          onChange={(e) => onIngredientChange(e, index)}
          error={!!formErrors.ingredients?.[index]?.ingredient}
          helperText={formErrors.ingredients?.[index]?.ingredient || ""}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <QuantityInput
          value={ingredient.quantity}
          onChange={handleQuantityChange}
          formErrors={!!formErrors?.ingredients?.[index]?.quantity}
          helperText={formErrors.ingredients?.[index]?.quantity}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <FormControl fullWidth error={!!formErrors.ingredients?.[index]?.unit}>
          <InputLabel>Unit</InputLabel>
          <Select value={ingredient.unit} label='Unit' name='unit' onChange={(e) => onUnitChange(e, index)}>
            {units.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </Select>
          {!!formErrors.ingredients?.[index]?.unit && <FormHelperText>{formErrors.ingredients?.[index]?.unit}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={2}>
        {canRemove && (
          <IconButton onClick={() => onRemove(index)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
};

export default IngredientInput;
