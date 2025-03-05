import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext({
  theme: "system",
  setTheme: () => null,
});

export default function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme" }) {
  const [theme, _setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (theme) => {
      root.classList.remove("light", "dark"); // Supprime les classes existantes
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      const effectiveTheme = theme === "system" ? systemTheme : theme;
      root.classList.add(effectiveTheme); // Ajoute la nouvelle classe du thème
    };

    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    applyTheme(theme);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (theme) => {
    localStorage.setItem(storageKey, theme);
    _setTheme(theme);
  };

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
