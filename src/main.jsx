import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PromptierDashboard from "../promptier.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PromptierDashboard />
  </StrictMode>
);
