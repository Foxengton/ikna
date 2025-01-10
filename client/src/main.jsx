import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Home from "./pages/Home.jsx";
import DeckIndex from "./pages/DeckIndex.jsx";
import DeckStudy from "./pages/DeckStudy.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/decks" element={<DeckIndex />} />
        <Route path="/study/:suid/:name" element={<DeckStudy />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
