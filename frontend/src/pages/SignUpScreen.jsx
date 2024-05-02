import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Autocomplete,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import { useAppState } from "../context/AppStateContext";
import { signupUser } from "../api";

const SignUpScreen = () => {
  const collegeNames = [
    "Assam Engineering College, Guwahati",
    "Indian Institute of Technology, Guwahati",
    "Sikkim Manipal Institute of Technology, Rangpo",
  ];

  const navigate = useNavigate();
  const { setIsAuthenticated } = useAppState();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institute, setInstitute] = useState(null);
  const [role, setRole] = useState(null);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const moveToSignIn = () => {
    navigate("/signin");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("The form got submitted");

    console.log("Username is: ", username);
    console.log("Email is: ", email);
    console.log("Password is: ", password);
    console.log("Institute is: ", institute);
    console.log("Role is: ", role);

    //make the post request here
    const response = await signupUser(
      username,
      email,
      password,
      institute,
      role
    );
    if (response.status == 201) {
      setIsAuthenticated(true);
      navigate("/join");
    }

    //clear all the fields
    // setUsername("");
    // setEmail("")
    // setPassword("");
    // setInstitute(null);
    // setRole(null);
    // setPasswordTouched(false);
  };

  const isPasswordValid = password.length >= 8;
  const isFormValid =
    username &&
    email &&
    password &&
    (passwordTouched ? isPasswordValid : true) &&
    institute &&
    role;

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
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            required
            margin="normal"
            id="username"
            label="Enter Name"
            name="username"
            autoComplete="false"
            autoFocus
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
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
            type="password"
            label="Enter Password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onBlur={() => setPasswordTouched(true)}
            error={passwordTouched && !isPasswordValid}
            helperText={
              passwordTouched &&
              !isPasswordValid &&
              "Password must be at least 8 characters long"
            }
          />
          <Autocomplete
            disablePortal
            fullWidth
            id="combo-box-demo"
            options={collegeNames}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Choose your Institution"
                margin="normal"
              />
            )}
            value={institute}
            onChange={(event, newValue) => setInstitute(newValue)}
          />
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              my: "1rem",
            }}
          >
            <Typography>Choose your role</Typography>

            <ToggleButtonGroup
              required
              exclusive
              value={role}
              onChange={(event, newRole) => {
                setRole(newRole);
              }}
            >
              <ToggleButton value="student" sx={{ px: "2rem" }}>
                Student
              </ToggleButton>
              <ToggleButton value="teacher" sx={{ px: "2rem" }}>
                Teacher
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

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
              // onClick={() => {
              //   setIsAuthenticated(true);
              //   navigate("/join");
              // }}
            >
              Sign Up
            </Button>
          </Box>

          <Box sx={{ my: { xs: "1rem", md: "2rem" } }}>
            <Button
              onClick={moveToSignIn}
              sx={{
                fontSize: "1rem",
                textTransform: "none",
                cursor: "pointer",
              }}
            >
              Already have an account? Sign In
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpScreen;
