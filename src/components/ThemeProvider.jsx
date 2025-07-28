'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }) {
  // All props are passed down to the original provider
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}