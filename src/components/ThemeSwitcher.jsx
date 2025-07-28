'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  // A simple button component for demonstration
  const Button = ({ onClick, children }) => (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        border: '1px solid hsl(var(--foreground))',
        borderRadius: '8px',
      }}
    >
      {children}
    </button>
  );

  return (
    <div>
      <p className="mb-2">Current theme: <strong>{theme}</strong></p>
      <div className="flex gap-2">
        <Button onClick={() => setTheme('light')}>Light</Button>
        <Button onClick={() => setTheme('dark')}>Dark</Button>
        <Button onClick={() => setTheme('system')}>System</Button>
      </div>
    </div>
  );
}