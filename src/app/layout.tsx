import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../components/Cart/CartProvider';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar1 from '../components/Navbar/Navbar1';
import Footer1 from '../components/Footer/Footer1';
import FloatingCartBox from '../components/Cart/FloatingCartBox';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Swish',
  description: 'Generated e-commerce website',
};

async function getMarketingConfig() {
  try {
    const res = await fetch('https://swish-server.vercel.app/digital-marketing', { cache: 'no-store' });
    if (!res.ok) return { metaPixel: null, gtm: null };
    return res.json();
  } catch {
    return { metaPixel: null, gtm: null };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let metaPixel = null;
  let gtm = null;
  try {
    const config = await getMarketingConfig();
    metaPixel = config.metaPixel;
    gtm = config.gtm;
  } catch {}

  return (
    <html lang="en">
      <head>
        {/* Meta Pixel SSR */}
        {metaPixel?.enabled && metaPixel?.id && (
          <>
            <Script id="facebook-pixel" strategy="beforeInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${metaPixel.id}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${metaPixel.id}&ev=PageView&noscript=1`}
                alt="Facebook Pixel"
              />
            </noscript>
          </>
        )}
        {/* GTM SSR */}
        {gtm?.enabled && gtm?.id && (
          <Script id="gtm" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtm.id}');
            `}
          </Script>
        )}
        {/* Fallback: Client-side injection if SSR fails */}
        <Script id="marketing-fallback" strategy="afterInteractive">
          {`
            (async function() {
              try {
                const res = await fetch('https://swish-server.vercel.app/digital-marketing');
                if (!res.ok) return;
                const data = await res.json();
                if (data.metaPixel && data.metaPixel.enabled && data.metaPixel.id && !window.fbq) {
                  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', data.metaPixel.id);
                  fbq('track', 'PageView');
                }
                if (data.gtm && data.gtm.enabled && data.gtm.id && !window.gtmInjected) {
                  window.gtmInjected = true;
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer',data.gtm.id);
                }
              } catch(e) {}
            })();
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <CartProvider>
            <Navbar1 />
            {children}
            <Footer1 />
            <FloatingCartBox />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}