"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars, FaTimes, FaPhone, FaUser, FaSignOutAlt } from "react-icons/fa";
import Searchbar from "./SearchBar";

// Define the Category type
interface Category {
  _id: string;
  name: string;
  img: string;
}

const Navbar1 = ({
  logo = null,
  phoneNumber = "+1 (555) 123-4567",
}: {
  logo?: string | null;
  phoneNumber?: string;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Fetch categories dynamically
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true);
      const response = await fetch("https://swish-server.vercel.app/categories");
      if (response.ok) {
        const data: Category[] = await response.json();
        setCategories(data);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  // Optimized resize handler with debounce
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    handleResize();
    fetchCategories();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize, fetchCategories]);

  // Optimized click outside handler
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen, handleClickOutside]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleLogOut = useCallback(async () => {
    try {
      setIsAuthenticated(false);
      setUserEmail(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }, []);

  return (
    <header className="bg-secondary sticky top-0 z-40 shadow-lg border-b-2 border-accent">
      {/* Main Navbar */}
      <div className="bg-secondary backdrop-blur-sm border-b border-accent">
        <div className="container mx-auto px-2 sm:px-4">
          {/* First Row - Logo and Menu/Phone */}
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-2 sm:gap-4">
            {/* Logo - Mobile and Desktop */}
            <Link
              href="/"
              className="flex-shrink-0 transform hover:scale-105 transition-transform duration-200"
            >
              {logo ? (
                <Image
                  src={logo}
                  alt="Logo"
                  width={120}
                  height={48}
                  className="h-8 sm:h-10 lg:h-16 xl:h-20 w-auto object-contain drop-shadow-sm"
                  priority
                />
              ) : (
                <h1 className="text-lg sm:text-xl lg:text-3xl xl:text-4xl font-bold text-primary">
                  Logo
                </h1>
              )}
            </Link>

            {/* Desktop Search Bar - Only show on large screens */}
            <div className="hidden lg:flex flex-1 min-w-0 mx-2 sm:mx-4 lg:mx-8 max-w-xs sm:max-w-md lg:max-w-2xl">
              <div className="w-full shadow-md rounded-lg overflow-hidden">
                <Searchbar />
              </div>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              {/* Phone Number */}
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center gap-2 bg-accent hover:bg-primary text-primary hover:text-secondary px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <FaPhone className="text-sm" />
                <span className="font-medium">{phoneNumber}</span>
              </a>
            </div>

            {/* Mobile Right Section */}
            <div className="lg:hidden flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Mobile Phone Icon */}
              <a
                href={`tel:${phoneNumber}`}
                className="p-2 sm:p-3 bg-accent hover:bg-primary text-primary hover:text-secondary rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                aria-label="Call us"
              >
                <FaPhone className="text-sm sm:text-lg" />
              </a>

              {/* Mobile Menu Button - Right */}
              <button
                onClick={toggleSidebar}
                className="p-2 sm:p-3 bg-secondary hover:bg-accent border-2 border-accent hover:border-primary rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                aria-label="Menu"
              >
                {isSidebarOpen ? (
                  <FaTimes className="text-lg sm:text-xl text-primary" />
                ) : (
                  <FaBars className="text-lg sm:text-xl text-primary" />
                )}
              </button>
            </div>
          </div>

          {/* Second Row - Mobile Search Bar */}
          <div className="lg:hidden pb-3">
            <div className="w-full shadow-md rounded-lg overflow-hidden">
              <Searchbar />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-secondary shadow-2xl transform transition-all duration-300 ease-out z-50 border-r-2 border-accent ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isSidebarOpen}
      >
        {/* Sidebar Header */}
        <div className="p-5 bg-primary text-secondary">
          <h2 className="text-lg font-bold">Menu</h2>
        </div>

        {/* Mobile Contact Info */}
        <div className="p-4 bg-accent border-b border-accent">
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center gap-3 text-primary hover:text-secondary transition-colors duration-200"
            onClick={toggleSidebar}
          >
            <div className="p-2 bg-secondary rounded-full">
              <FaPhone className="text-sm" />
            </div>
            <span className="font-medium">{phoneNumber}</span>
          </a>
        </div>

        {/* Mobile Auth Section */}
        {isMobile && (
          <div className="p-5 border-b border-accent bg-accent">
            {!isAuthenticated ? (
              <Link
                href="/pages/login"
                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-accent hover:border-primary text-secondary hover:text-primary py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg border-2 border-primary"
                onClick={toggleSidebar}
              >
                <FaUser className="text-sm" />
                Login / Register
              </Link>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg border border-accent">
                  <div className="p-2 bg-accent rounded-full">
                    <FaUser className="text-sm text-primary" />
                  </div>
                  <span className="text-sm text-primary truncate font-medium">
                    {userEmail}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogOut();
                    toggleSidebar();
                  }}
                  className="flex items-center justify-center gap-2 w-full border-2 border-primary hover:bg-accent hover:border-accent text-primary py-3 px-4 rounded-lg font-semibold transition-all duration-200"
                >
                  <FaSignOutAlt className="text-sm" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Categories Section */}
        <div className="flex-1 overflow-y-auto bg-secondary">
          <div className="p-5">
            <h3 className="text-base font-semibold text-primary mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              Categories
            </h3>

            {isLoadingCategories ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : categories.length > 0 ? (
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <Link
                    key={category._id}
                    href={`/category/${category._id}`}
                    className="group flex items-center gap-3 p-3 hover:bg-accent hover:shadow-md transition-all duration-200 border border-transparent hover:border-primary rounded-xl transform hover:-translate-y-0.5"
                    onClick={toggleSidebar}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isSidebarOpen
                        ? "slideInLeft 0.3s ease-out forwards"
                        : "none",
                    }}
                  >
                    <div className="flex-shrink-0 p-2 bg-accent group-hover:bg-secondary rounded-lg transition-colors duration-200">
                      <Image
                        src={category.img}
                        alt={category.name}
                        width={32}
                        height={32}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium text-primary group-hover:text-primary truncate transition-colors duration-200">
                      {category.name}
                    </span>
                    <div className="ml-auto w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-3 flex items-center justify-center">
                  <FaBars className="text-primary text-xl" />
                </div>
                <p className="text-sm text-primary">No categories available</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Enhanced Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Keyframes for animations */}
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar1;
