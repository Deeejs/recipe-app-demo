import React, { useState } from "react";
import { TextField, Tooltip } from "@mui/material";

const QuantityInput = ({ value, onChange, formErrors, helperText }) => {
  // manage error state for incorrect input
  const [error, setError] = useState(false);
  // Disallow non-numeric characters except for spaces, slashes, and periods
  const isValidInput = (input) => {
    // eslint-disable-next-line
    const validPattern = /^[0-9.\/\s]*$/;
    return validPattern.test(input);
  };

  const handleChange = (event) => {
    const inputValue = event.target.value;
    if (isValidInput(inputValue)) {
      setError(false);
      console.log("Input Value:", inputValue);
      onChange(inputValue); // push changes to parent component
    } else {
      setError(true);
    }
  };

  return (
    <Tooltip
      title='Enter a quantity (e.g., 1, 1/2, 0.5, 1 1/2)'
      placement='top'
      enterTouchDelay={0}
      style={{ display: "flex", alignItems: "flex-start" }}
    >
      <TextField
        label='Quantity'
        variant='outlined'
        placeholder='(e.g., 1, 1/2, 0.5, 1 1/2)'
        value={value}
        onChange={handleChange}
        error={error || formErrors}
        helperText={helperText}
        fullWidth
      />
    </Tooltip>
  );
};

export default QuantityInput;
