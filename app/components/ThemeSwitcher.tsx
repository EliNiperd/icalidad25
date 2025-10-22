'use client'

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect solo se ejecuta en el cliente, evitando el error de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Renderiza un placeholder durante SSR para evitar mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <div className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};