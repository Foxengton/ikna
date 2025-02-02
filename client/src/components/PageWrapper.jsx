import { createContext } from "react";
import { useEffect } from "react";
import { Children } from "react";
import NavigationBar from "../components/NavigationBar.jsx";
import Cookies from "js-cookie";
import AuthContext from "../contexts/AuthContext.jsx";
import { useState } from "react";

export default function PageWrapper({ children }) {
  const [userData, setUserData] = useState({});
  useEffect(() => {
    try {
      setUserData(JSON.parse(Cookies.get("user-data")));
    } catch {
      setUserData(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={userData}>
      <div className="bg-slate-50 min-h-screen flex flex-col font-noto">
        <NavigationBar />
        {Children.toArray(children)}
      </div>
    </AuthContext.Provider>
  );
}
