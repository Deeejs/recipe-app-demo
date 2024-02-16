// components/NotFoundPage.js or pages/NotFoundPage.js

import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Container component='main' maxWidth='sm' style={{ textAlign: "center", marginTop: "100px" }}>
      <Typography variant='h4' gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant='subtitle1'>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Typography>
      <Button variant='contained' color='primary' component={Link} to='/' style={{ marginTop: "20px" }}>
        Go to Homepage
      </Button>
    </Container>
  );
};

export default NotFoundPage;
