import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { AppStateProvider } from "./context/AppStateContext.jsx";
import App from "./App.jsx";
import HomeScreen from "./pages/HomeScreen.jsx";
import MeetingView from "./pages/MeetingView.jsx";

import "./index.css";
import MeetingSummary from "./pages/MeetingSummary.jsx";

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
        path: "/meeting",
        element: <MeetingView />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppStateProvider>
    <RouterProvider router={router} />
  </AppStateProvider>
);
