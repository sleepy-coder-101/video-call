import React from "react";
import { Navigate } from "react-router-dom";
import { useAppState } from "./context/AppStateContext";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useAppState();

  return user ? <Component {...rest} /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
