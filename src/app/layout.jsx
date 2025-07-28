
import './globals.css';
import { ErrorProvider } from '../context/ErrorContext';
// import { ThemeProvider } from '../components/ThemeProvider';

export const metadata = {
  title: 'My Job Portal',
  description: 'Next.js Job Portal by Sonali',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
          <ErrorProvider>
            {children}
          </ErrorProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
