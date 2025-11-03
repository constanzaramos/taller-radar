import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { DateProvider } from "./context/DateContext.jsx"; // 👈 importamos el provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DateProvider>
      <App />
    </DateProvider>
  </React.StrictMode>
);
