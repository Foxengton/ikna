import { useEffect } from "react";
import NavigationBar from "../components/NavigationBar.jsx";

export default function PageWrapper({ children, title = "Ikna" }) {
  useEffect(() => {
    document.title = title;
  }, []);

  return (
    <div className="relative bg-slate-50 min-h-screen flex flex-col font-noto">
      <NavigationBar />
      {children}
    </div>
  );
}
