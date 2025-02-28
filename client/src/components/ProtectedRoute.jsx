import { useContext, useState } from "react";
import { Outlet } from "react-router";
import { AuthContext } from "../contexts/AuthProvider.jsx";
import { useNavigate } from "react-router";
import PageWrapper from "./PageWrapper.jsx";

export default function ProtectedRoute() {
  const [userData, setUserData] = useContext(AuthContext);
  const navigate = useNavigate();
  const username = userData?.username;

  useContext(() => {
    if (!username) navigate("/login", { replace: true });
  }, [userData]);

  return <Outlet />;
}
