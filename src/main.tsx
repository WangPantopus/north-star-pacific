import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import ScanPage from "./scan/ScanPage";
import ScanReportPage from "./scan/ScanReportPage";
import "./App.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element #root was not found.");
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/scan/r/:id" element={<ScanReportPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

