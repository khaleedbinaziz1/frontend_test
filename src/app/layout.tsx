import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../components/Cart/CartProvider';
import { ThemeProvider } from './../context/ThemeContext';
import Navbar1 from '../components/Navbar/Navbar1';
import Footer1 from '../components/Footer/Footer1';
import FloatingCartBox from '../components/Cart/FloatingCartBox'; // Add this import

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Swish',
  description: 'Generated e-commerce website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <CartProvider>
            <Navbar1 />
            {children}
            <Footer1 />
            
            {/* Floating Cart Box - appears on all pages */}
            <FloatingCartBox 
             
            />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}