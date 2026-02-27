'use client';

import { useEffect, useState } from 'react';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if dark mode is already set
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkState = !isDark;
    setIsDark(newDarkState);
    
    if (newDarkState) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-10 py-3">
      <div className="flex items-center gap-4">
        <div className="size-8 flex items-center justify-center rounded bg-primary text-white">
          <span className="material-symbols-outlined text-xl">code</span>
        </div>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
          DevPortfolio
        </h2>
      </div>

      <div className="hidden md:flex flex-1 justify-end gap-8">
        <nav className="flex items-center gap-9">
          <a
            href="#home"
            className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal"
          >
            Home
          </a>
          <a
            href="#projects"
            className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal"
          >
            Projects
          </a>
          <a
            href="#experience"
            className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal"
          >
            Experience
          </a>
          <a
            href="#articles"
            className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal"
          >
            Articles
          </a>
        </nav>
        <button
          onClick={toggleDarkMode}
          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]"
        >
          <span className="truncate">{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      <div className="md:hidden">
        <button className="text-slate-900 dark:text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
}
