"use client";
import { useEffect, useState } from 'react';

export default function MarketingScripts() {
  const [metaPixel, setMetaPixel] = useState<{ id: string; enabled: boolean } | null>(null);
  const [gtm, setGtm] = useState<{ id: string; enabled: boolean } | null>(null);

  useEffect(() => {
    fetch('https://swish-server.vercel.app/digital-marketing')
      .then(res => res.json())
      .then(data => {
        setMetaPixel(data.metaPixel || null);
        setGtm(data.gtm || null);
      });
  }, []);

  useEffect(() => {
    // Inject Meta Pixel
    if (metaPixel && metaPixel.enabled && metaPixel.id) {
      if (!document.getElementById('meta-pixel-script')) {
        const script = document.createElement('script');
        script.id = 'meta-pixel-script';
        script.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${metaPixel.id}');fbq('track', 'PageView');`;
        document.head.appendChild(script);
      }
      if (!document.getElementById('meta-pixel-noscript')) {
        const noscript = document.createElement('noscript');
        noscript.id = 'meta-pixel-noscript';
        noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${metaPixel.id}&ev=PageView&noscript=1"/>`;
        document.body.appendChild(noscript);
      }
    }
    // Inject GTM
    if (gtm && gtm.enabled && gtm.id) {
      if (!document.getElementById('gtm-script')) {
        const script = document.createElement('script');
        script.id = 'gtm-script';
        script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm.id}');`;
        document.head.appendChild(script);
      }
      if (!document.getElementById('gtm-noscript')) {
        const noscript = document.createElement('noscript');
        noscript.id = 'gtm-noscript';
        noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtm.id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.appendChild(noscript);
      }
    }
  }, [metaPixel, gtm]);

  return null;
} 