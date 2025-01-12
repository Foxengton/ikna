import { Children } from "react";
import NavigationBar from "../components/NavigationBar.jsx";

export default function PageWrapper({ children }) {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-noto">
      <NavigationBar />
      {Children.toArray(children)}
    </div>
  );
}
