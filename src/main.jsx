import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { LibraryProvider } from "./context/LibraryContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LibraryProvider>
      <App />
    </LibraryProvider>
  </React.StrictMode>
);
