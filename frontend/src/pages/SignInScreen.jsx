import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useAppState } from "../context/AppStateContext";
import { signinUser } from "../api";

const SignInScreen = () => {
  const navigate = useNavigate();
  const { setUserData, checkTokenValidity } = useAppState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const moveToSignUp = () => {
    navigate("/signup");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("The form got submitted");

    console.log("Email is: ", email);
    console.log("Password is: ", password);

    try {
      const response = await signinUser(email, password);
      if (response.status === 200) {
        console.log(response.token);
        setUserData(response.token);
        navigate("/prejoin");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error in logging in user", error);
    }
  };

  useEffect(() => {
    const isTokenValid = checkTokenValidity();
    if (!isTokenValid) {
      navigate("/signin");
    } else {
      navigate("/prejoin");
    }
  }, []);

  const isFormValid = email && password;

  return (
    <Container>
      <CssBaseline />
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            required
            margin="normal"
            id="email"
            label="Enter Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            fullWidth
            required
            margin="normal"
            id="password"
            type={showPassword ? "text" : "password"}
            label="Enter Password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              mt: "2rem",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{ paddingX: "1rem", margin: "1rem", fontSize: "1rem" }}
              disabled={!isFormValid}
            >
              Sign In
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              my: { xs: "1rem", md: "2rem" },
            }}
          >
            <Box sx={{ my: { xs: "0.2rem" } }}>
              <Button
                onClick={moveToSignUp}
                sx={{
                  fontSize: "1rem",
                  textTransform: "none",
                  cursor: "pointer",
                }}
              >
                Don't have an account? Sign Up
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignInScreen;
