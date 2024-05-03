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
import JoinScreen from "./pages/JoinScreen.jsx";
import Meeting from "./pages/Meeting.jsx";
import Prejoin from "./pages/Prejoin.jsx";

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
        element: <Prejoin />,
      },
      {
        path: "/join",
        element: <JoinScreen />,
      },
      {
        path: "/meeting",
        element: <Meeting />,
      },
      {
        path: "/summary",
        element: <MeetingSummary />,
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
    <RouterProvider router={router} />
  </AppStateProvider>
);
