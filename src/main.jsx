import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// Import token manager (in-memory token storage, NOT localStorage)
import "./services/api/tokenManager.js";
// Import API token config (auto-sets token for development)
import "./config/apiToken.js";
// Import API token helper for testing (provides window.setApiToken, etc.)
import "./utils/apiTokenHelper.js";
// Import API diagnostics helper (provides window.checkApiAuth)
import "./utils/apiDiagnostics.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
