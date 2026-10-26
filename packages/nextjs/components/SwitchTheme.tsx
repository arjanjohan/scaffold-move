"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export const SwitchTheme = ({ className = "" }: { className?: string }) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDarkMode = resolvedTheme === "dark";

  const handleToggle = () => {
    if (isDarkMode) {
      setTheme("light");
      return;
    }
    setTheme("dark");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex space-x-2 h-8 items-center justify-center text-sm ${className}`}>
      {/* daisyUI draws the knob in the toggle's text color, so don't give the track the same background */}
      <input
        id="theme-toggle"
        type="checkbox"
        className="toggle toggle-primary [--depth:0]"
        aria-label="Dark mode"
        onChange={handleToggle}
        checked={isDarkMode}
      />
      <label
        htmlFor="theme-toggle"
        aria-hidden="true"
        className={`swap swap-rotate ${!isDarkMode ? "swap-active" : ""}`}
      >
        <SunIcon className="swap-on h-5 w-5" />
        <MoonIcon className="swap-off h-5 w-5" />
      </label>
    </div>
  );
};
