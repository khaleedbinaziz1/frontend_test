"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Footer1 = () => {
  const [footerData, setFooterData] = useState({
    logo: null,
    footerInfo: {},
    aboutUs: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch('https://swish-server.vercel.app/getmedia');
        const data = await response.json();
        setFooterData(data);
      } catch (err) {
        console.error('Error fetching footer data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFooterData();
  }, []);

  // Social media icons
  const socialIcons = {
    facebook: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>,
    instagram: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>,
    twitter: <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>,
    linkedin: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>,
    youtube: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>,
    whatsapp: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  };

  const SocialIcon = ({ name, url }) => (
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

  // Animated Pixentix Component
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
        <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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

  const { footerInfo, logo, aboutUs } = footerData;

  // Filter social media links
  const socialLinks = Object.entries(footerInfo || {})
    .filter(([key, value]) => 
      value && ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'whatsapp'].includes(key.toLowerCase())
    )
    .map(([key, value]) => ({
      name: key,
      url: key === 'whatsapp' ? `https://wa.me/${value.replace(/\D/g, '')}` : value
    }));

  // Contact info
  const contactInfo = [
    { key: 'phone', value: footerInfo.phone, icon: '📞' },
    { key: 'email', value: footerInfo.email, icon: '✉️' },
    { key: 'location', value: footerInfo.location, icon: '📍' },
    { key: 'openingHours', value: footerInfo.openingHours, icon: '⏰' }
  ].filter(item => item.value);

  return (
    <footer className="bg-primary text-white relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary/3 to-accent/3"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.05),transparent_50%)] opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,111,97,0.05),transparent_50%)] opacity-50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            {logo && (
              <div className="group relative inline-block">
                <div className="absolute inset-0 bg-secondary rounded-lg blur opacity-100 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-3 bg-secondary/10 rounded-lg border border-secondary/20 hover:border-secondary/40 transition-all duration-300">
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="h-12 w-auto filter brightness-110 group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              {[
                { href: '/about', label: 'About Company' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/careers', label: 'Careers' }
              ].map((link, index) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="group flex items-center space-x-2 text-white/70 hover:text-accent transition-all duration-300 text-sm py-1"
                >
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
                { href: '/help', label: 'Help Center' },
                { href: '/returns', label: 'Return Policy' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' }
              ].map((link, index) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="group flex items-center space-x-2 text-white/70 hover:text-accent transition-all duration-300 text-sm py-1"
                >
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
              {contactInfo.map(({ key, value, icon }, index) => (
                <div 
                  key={key} 
                  className="flex items-start space-x-3 text-sm group"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs group-hover:bg-accent/20 transition-colors duration-300">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/50 text-xs uppercase tracking-wide mb-1">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p className="text-white/90 font-medium">
                      {key === 'phone' ? (
                        <a href={`tel:${value}`} className="hover:text-accent transition-colors">
                          {value}
                        </a>
                      ) : key === 'email' ? (
                        <a href={`mailto:${value}`} className="hover:text-accent transition-colors break-all">
                          {value}
                        </a>
                      ) : value}
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
              {socialLinks.map(({ name, url }, index) => (
                <div 
                  key={name}
                  className="animate-fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <SocialIcon name={name} url={url} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-white/60 text-sm text-center lg:text-left">
              © {new Date().getFullYear()} {footerInfo.copyright || 'Company Name'}. All rights reserved.
            </p>
            <AnimatedPixentix />
          </div>
        </div>
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