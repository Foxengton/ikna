import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import DeckIndex from "./pages/DeckIndex.jsx";
import DeckStudy from "./pages/DeckStudy.jsx";
import DeckEdit from "./pages/DeckEdit.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";
import ThemeProvider from "./contexts/ThemeProvider.jsx";
import Test from "./pages/Test1.jsx";
import Error404 from "./pages/Error404";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Error404 />} />
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/decks" element={<DeckIndex />} />
              <Route path="/study/:guid/:name" element={<DeckStudy />} />
              <Route path="/study/:guid" element={<DeckStudy />} />
              <Route path="/edit/:guid/" element={<DeckEdit />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
