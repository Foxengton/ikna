import { createContext, useState } from "react";
import Cookies from "js-cookie";
import { useEffect } from "react";
import api from "../services/api.jsx";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [userData, setUserData] = useState(
    JSON.parse(Cookies.get("user-data") ?? "null")
  );

  // Maintaining equality between state and cookie values
  useEffect(() => {
    Cookies.set("user-data", JSON.stringify(userData), { expires: 365 });
  }, [userData]);

  useEffect(() => {
    fetchToken();
  }, []);

  // Login attempt on the first load
  async function fetchToken() {
    const result = await api("post", "/login", userData.token);
    setUserData(result?.data ?? null);
  }

  return (
    <AuthContext.Provider value={[userData, setUserData]}>
      {children}
    </AuthContext.Provider>
  );
}
