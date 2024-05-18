import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";

import { AppStateProvider } from "./context/AppStateContext.jsx";
import App from "./App.jsx";
import HomeScreen from "./pages/HomeScreen.jsx";
import MeetingSummary from "./pages/MeetingSummary.jsx";
import SignInScreen from "./pages/SignInScreen.jsx";
import SignUpScreen from "./pages/SignUpScreen.jsx";
import Prejoin from "./pages/Prejoin.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import MeetingContainer from "./pages/MeetingContainer.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomeScreen />,
      },
      {
        path: "/prejoin",
        element: <ProtectedRoute component={Prejoin} />,
      },
      {
        path: "/meeting",
        element: <ProtectedRoute component={MeetingContainer} />,
      },
      {
        path: "/summary",
        element: <ProtectedRoute component={MeetingSummary} />,
      },
      {
        path: "/signin",
        element: <SignInScreen />,
      },
      {
        path: "/signup",
        element: <SignUpScreen />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppStateProvider>
    {/* <AppWrapper /> */}
    <RouterProvider router={router} />
  </AppStateProvider>
);
