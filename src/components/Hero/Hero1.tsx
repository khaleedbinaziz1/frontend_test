"use client";

import { useState, useEffect } from "react";

export default function Hero1() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const res = await fetch("http://localhost:500/getmedia");
        const data = await res.json();
        if (res.ok && Array.isArray(data.heroImages)) {
          setHeroImages(data.heroImages);
        }
      } catch (error) {
        console.error("Error fetching hero images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying && heroImages.length > 0) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, heroImages]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-100">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full animate-pulse bg-gray-200">
          <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
        </div>
      ) : heroImages.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-200">
          <p className="text-gray-500">No hero images available</p>
        </div>
      ) : (
        <>
          {/* Image Slides */}
          <div className="relative w-full h-full">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute w-full h-full transition-opacity duration-500 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={image}
                  alt={`Hero image ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 sm:p-2 rounded-full transition-all z-10"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 sm:p-2 rounded-full transition-all z-10"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition ${
                  index === currentSlide ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play control */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="bg-black/30 hover:bg-black/50 text-white p-1 sm:p-2 rounded-full"
              aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isAutoPlaying ? (
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
