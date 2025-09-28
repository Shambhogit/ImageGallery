import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router"; // ✅ use react-router-dom
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import AuthPage from "./pages/AuthPage.jsx";

createRoot(document.getElementById("root")).render(

  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* main route */}
        <Route path="/home" element={<App />} />

        {/* auth route */}
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
