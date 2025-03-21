import { createContext, useState } from "react";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const defaultTheme = {
    card: {
      front: {
        base: "bg-white text-black",
        inputEdit: "bg-slate-100",
      },
      back: {
        base: "bg-neutral-900 text-white",
        inputEdit: "bg-neutral-800",
      },
      size: "w-80 min-h-80",
    },
  };
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
}
