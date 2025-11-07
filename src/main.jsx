import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { DateProvider } from "./context/DateContext.jsx";
import { FilterProvider } from "./context/FilterContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DateProvider>
      <FilterProvider>
        <App />
      </FilterProvider>
    </DateProvider>
  </React.StrictMode>
);
