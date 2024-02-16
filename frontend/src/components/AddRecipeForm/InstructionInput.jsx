import React from "react";
import { Grid, TextField, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

// Instruction Input component for adding a new recipe form
const InstructionInput = ({ instruction, index, onInstructionChange, onRemove, canRemove, formErrors }) => {
  return (
    <Grid container spacing={1} alignItems='flex-end' style={{ marginBottom: "10px" }}>
      <Grid item xs={10}>
        <TextField
          fullWidth
          label='Instruction'
          value={instruction.direction}
          onChange={onInstructionChange}
          error={!!formErrors.instructions?.[index]?.direction}
          helperText={formErrors.instructions?.[index]?.direction || ""}
        />
      </Grid>
      <Grid item xs={2}>
        {canRemove && (
          <IconButton onClick={onRemove}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
};

export default InstructionInput;
