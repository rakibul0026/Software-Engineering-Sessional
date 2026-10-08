import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./styles.css";
import { routeDefinitions } from "./routes.generated";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {routeDefinitions.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
