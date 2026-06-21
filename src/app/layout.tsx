import type { Metadata } from 'next';
import { CartProvider } from '@/components/CartContext';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'NitheeshRestuarent | Fine Dining Restaurant',
  description: 'Welcome to NitheeshRestuarent, an exquisite culinary sanctuary of French haute cuisine, nestled in the heart of Paris.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="app-layout">
            <Navbar />
            <main className="app-main-content">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
