
import './globals.css';
import { ErrorProvider } from '../context/ErrorContext';

export const metadata = {
  title: 'My Job Portal',
  description: 'Next.js Job Portal by Sonali',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorProvider>
          {children}
        </ErrorProvider>
      </body>
    </html>
  );
}
