import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

if (typeof document !== "undefined" && import.meta.env.VITE_APP_NAME) {
  document.title = import.meta.env.VITE_APP_NAME;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
