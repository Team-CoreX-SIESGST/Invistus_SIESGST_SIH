"use client";

import React from "react";
import { useTheme } from "../Theme/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export const Navbar = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <nav
      className="flex items-center justify-between px-6 py-4 shadow-md border-b border-[var(--border)] bg-[var(--card-bg)]"
    >
      {/* Logo / Title */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold">
          AI
        </div>
        <span className="text-[var(--heading)] font-semibold text-lg">
          Invistus Dashboard
        </span>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex items-center space-x-6 text-[var(--text)] font-medium">
        <li className="hover:text-[var(--hover-text)] cursor-pointer transition">Home</li>
        <li className="hover:text-[var(--hover-text)] cursor-pointer transition">Dashboard</li>
        <li className="hover:text-[var(--hover-text)] cursor-pointer transition">Reports</li>
        <li className="hover:text-[var(--hover-text)] cursor-pointer transition">Settings</li>
      </ul>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-[var(--secondary-bg)] hover:bg-[var(--hover-bg)] transition"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-800" />
          )}
        </button>

        {/* Mobile Hamburger */}
        <button className="md:hidden p-2 rounded-md bg-[var(--secondary-bg)] hover:bg-[var(--hover-bg)] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[var(--text)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};
