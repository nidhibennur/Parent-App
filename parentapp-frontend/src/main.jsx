import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import { router } from "./routes/router.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Apply dark mode before first render to prevent flash
try {
  const prefs = JSON.parse(localStorage.getItem("parentapp_prefs") || "{}");
  if (prefs.darkMode) document.documentElement.classList.add("dark-mode");
} catch { /* noop */ }

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
