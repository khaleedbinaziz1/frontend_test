'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
  img: string;
  created_time: string;
  updated_time: string;
}

const TopCategories1 = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:500/categories');
        setCategories(response.data.slice(0, 5));
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <div className="h-6 sm:h-8 bg-gray-300 rounded-lg w-48 sm:w-64 mx-auto mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 sm:w-80 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm animate-pulse">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg mx-auto mb-2 sm:mb-3"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 bg-gray-50">      
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg mx-auto mb-3 sm:mb-4 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2m0 0l2 2-2 2M5 13l-2-2 2-2m0 0l-2-2 2-2" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Top Categories
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Discover our most popular categories
          </p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
          {categories.map((category) => (
            <Link
              key={category._id}
              href="/products"
              className="group"
            >
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-gray-200">
                {/* Image container */}
                <div className="mb-2 sm:mb-3">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto">
                    <Image
                      src={category.img}
                      alt={category.name}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 48px, 64px"
                      loading="lazy"
                    />
                  </div>
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300 mb-1 line-clamp-2">
                    {category.name}
                  </h3>
                
                </div>
              </div>
            </Link>
          ))}
        </div>
        
 
      </div>
    </section>
  );
};

export default TopCategories1;