// src/components/ThemeToggle.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

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

  const themes = [
    { value: "light", label: "Light", },
    { value: "dark", label: "Dark", },
  ] as const;

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className="focus:ring-0 text-xs dark:bg-black ">
        <SelectValue className="text-xs">
          {currentTheme.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="focus:ring-0">
        {themes.map((themeOption) => (
          <SelectItem key={themeOption.value} value={themeOption.value} className="focus:ring-0 text-xs">
            {themeOption.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
