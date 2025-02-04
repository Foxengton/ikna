import { createContext, useState } from "react";
import Cookies from "js-cookie";
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [userData, setUserData] = useState(
    JSON.parse(Cookies.get("user-data") ?? "null")
  );
  return (
    <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
  );
}
