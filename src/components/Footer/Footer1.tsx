"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import React from "react";

interface FooterInfo {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
  location?: string;
  openingHours?: string;
  copyright?: string;
}

interface FooterData {
  logo: string | null;
  footerInfo: FooterInfo;
  aboutUs: string;
}

const Footer1 = () => {
  const [footerData, setFooterData] = useState<FooterData>({
    logo: null,
    footerInfo: {},
    aboutUs: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch("https://swish-server.vercel.app/getmedia");
        const data = await response.json();
        setFooterData(data);
      } catch (err) {
        console.error("Error fetching footer data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFooterData();
  }, []);

  const socialIcons: Record<string, React.ReactElement> = {
    facebook: (
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    ),
    instagram: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 ... (truncated for brevity) ..." />
    ),
    twitter: (
      <path d="M23.953 4.57a10 10 0 01-2.825.775 ... (truncated for brevity) ..." />
    ),
    linkedin: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328 ... (truncated for brevity) ..." />
    ),
    youtube: (
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136 ... (truncated for brevity) ..." />
    ),
    whatsapp: (
      <path d="M17.472 14.382c-.297-.149-1.758-.867 ... (truncated for brevity) ..." />
    ),
  };

  const SocialIcon = ({ name, url }: { name: string; url: string }) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full hover:bg-accent/20 transition-all duration-300 hover:scale-110 border border-white/20 hover:border-accent/50"
    >
      <svg className="w-5 h-5 fill-white group-hover:fill-accent transition-all duration-300" viewBox="0 0 24 24">
        {socialIcons[name.toLowerCase()]}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </a>
  );

  const AnimatedPixentix = () => (
    <a
      href="https://pixentix.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-all duration-300 border border-neutral-700 shadow-md hover:shadow-lg active:scale-95"
    >
      <span className="text-white text-sm">Powered by</span>
      <span className="relative text-base font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
        PIXENTIX
      </span>
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
        <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      </div>
    </a>
  );

  if (loading) {
    return (
      <footer className="bg-primary text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary/10 to-accent/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
        </div>
      </footer>
    );
  }

  const { footerInfo, logo } = footerData;

  const socials = Object.entries(footerInfo)
    .filter(([key]) => socialIcons[key])
    .map(([key, value]) => ({
      name: key,
url: key === 'whatsapp'
  ? `https://wa.me/${String(value).replace(/\D/g, '')}`
  : String(value)

    }));

  const contactInfo = [
    { key: "phone", value: footerInfo.phone, icon: "📞" },
    { key: "email", value: footerInfo.email, icon: "✉️" },
    { key: "location", value: footerInfo.location, icon: "📍" },
    { key: "openingHours", value: footerInfo.openingHours, icon: "⏰" },
  ].filter((item) => item.value);

  return (
    <footer className="bg-primary text-white relative overflow-hidden p-10">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary/3 to-accent/3"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.05),transparent_50%)] opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,111,97,0.05),transparent_50%)] opacity-50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="lg:col-span-1 space-y-6">
          {logo && (
            <div className="group relative inline-block">
              <div className="absolute inset-0 bg-secondary rounded-lg blur opacity-100 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-3 bg-secondary/10 rounded-lg border border-secondary/20 hover:border-secondary/40 transition-all duration-300">
                <img src={logo} alt="Logo" className="h-12 w-auto filter brightness-110 group-hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            {[
              { href: "/about", label: "About Company" },
              { href: "/contact", label: "Contact Us" },
              { href: "/careers", label: "Careers" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="group flex items-center space-x-2 text-white/70 hover:text-accent transition-all duration-300 text-sm py-1">
                <span className="w-0 h-0.5 bg-accent group-hover:w-3 transition-all duration-300"></span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white relative">
            Quick Links
            <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-accent rounded-full"></div>
          </h3>
          <div className="space-y-2">
            {[
              { href: "/help", label: "Help Center" },
              { href: "/returns", label: "Return Policy" },
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms of Service" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="group flex items-center space-x-2 text-white/70 hover:text-accent transition-all duration-300 text-sm py-1">
                <span className="w-0 h-0.5 bg-accent group-hover:w-3 transition-all duration-300"></span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white relative">
            Contact Info
            <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-accent rounded-full"></div>
          </h3>
          <div className="space-y-4">
            {contactInfo.map(({ key, value, icon }) => (
              <div key={key} className="flex items-start space-x-3 text-sm group">
                <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs group-hover:bg-accent/20 transition-colors duration-300">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/50 text-xs uppercase tracking-wide mb-1">{key.replace(/([A-Z])/g, " $1")}</p>
                  <p className="text-white/90 font-medium">
                    {key === "phone" ? (
                      <a href={`tel:${value}`} className="hover:text-accent transition-colors">{value}</a>
                    ) : key === "email" ? (
                      <a href={`mailto:${value}`} className="hover:text-accent transition-colors break-all">{value}</a>
                    ) : (
                      value
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white relative">
            Follow Us
            <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-accent rounded-full"></div>
          </h3>
          <div className="flex flex-wrap gap-3">
            {socials.map(({ name, url }, index) => (
              <div key={name} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <SocialIcon name={name} url={url} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-8 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
        <p className="text-white/60 text-sm text-center lg:text-left">
          © {new Date().getFullYear()} {footerInfo.copyright || "Company Name"}. All rights reserved.
        </p>
        <AnimatedPixentix />
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </footer>
  );
};

export default Footer1;
