import { createContext, useState } from "react";
import Cookies from "js-cookie";
import { useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [userData, setUserData] = useState(
    JSON.parse(Cookies.get("user-data") ?? "null")
  );

  // Maintaining equality between state and cookie values
  useEffect(() => {
    Cookies.set("user-data", JSON.stringify(userData));
  }, [userData]);

  return (
    <AuthContext.Provider value={[userData, setUserData]}>
      {children}
    </AuthContext.Provider>
  );
}
