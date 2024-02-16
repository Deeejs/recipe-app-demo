import React, { useState } from "react";
import { Button, IconButton } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CancelIcon from "@mui/icons-material/Cancel";

const ImageUpload = ({ onImageUpload }) => {
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewUrl(URL.createObjectURL(file));
      onImageUpload(file); // Invoke the passed function with the selected file
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    onImageUpload(null); // Notify the parent component that the image has been removed
    // Reset the file input so the user can upload the same file again if desired
    document.getElementById("image-upload-input").value = "";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "10px" }}>
      {previewUrl && (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img src={previewUrl} alt='Preview' style={{ width: "100px", height: "100px", objectFit: "cover" }} />
          <IconButton
            size='small'
            style={{ position: "absolute", top: 0, right: 0, color: "white", backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            onClick={handleRemoveImage}
          >
            <CancelIcon />
          </IconButton>
        </div>
      )}
      <div style={{ marginTop: "10px" }}>
        <input accept='image/*' style={{ display: "none" }} id='image-upload-input' type='file' onChange={handleImageChange} />
        <label htmlFor='image-upload-input'>
          <Button variant='contained' component='span' startIcon={<PhotoCamera />} style={{ marginTop: previewUrl ? "10px" : "0" }}>
            Upload Image
          </Button>
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
