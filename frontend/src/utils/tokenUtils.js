import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken);
    return decodedToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
