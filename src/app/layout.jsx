// src/app/layout.jsx
import './globals.css';

export const metadata = {
  title: 'My Job Portal',
  description: 'Next.js Job Portal by Sonali',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
