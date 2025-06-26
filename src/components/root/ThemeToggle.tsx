// src/components/ThemeToggle.tsx
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import React from "react";

export function ThemeToggle() {
  const { isDark, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const getThemeIcon = () => {
    return isDark ? <Moon /> : <Sun />;
  };

  const getThemeLabel = () => {
    return isDark ? "Dark" : "Light";
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        inline-flex items-center justify-center
        h-9 w-9 rounded-full
        bg-gray-100 text-black
        hover:opacity-70
        border border-gray-200
        dark:bg-gray-900 dark:text-white
        transition-colors duration-200
      "
      title={`Current theme: ${getThemeLabel()}. Click to switch.`}
    >
      <span className="text-lg">{getThemeIcon()}</span>
    </button>
  );
}

// Alternative dropdown version
export function ThemeToggleDropdown() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const themes = [
    { value: "light", label: "Light", icon: "☀️" },
    { value: "dark", label: "Dark", icon: "🌙" },
  ] as const;

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          inline-flex items-center justify-center gap-2
          h-10 px-3 rounded-md
          bg-secondary text-secondary-foreground
          hover:bg-secondary/80
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        "
      >
        <span>{currentTheme.icon}</span>
        <span className="text-sm font-medium">{currentTheme.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="
          absolute top-full mt-1 right-0
          bg-popover text-popover-foreground
           rounded-md shadow-lg
          min-w-[120px] z-50
        "
        >
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => {
                setTheme(themeOption.value);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-2 px-3 py-2 text-sm
                hover:bg-accent hover:text-accent-foreground
                transition-colors
                ${
                  theme === themeOption.value
                    ? "bg-accent text-accent-foreground"
                    : ""
                }
              `}
            >
              <span>{themeOption.icon}</span>
              <span>{themeOption.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
