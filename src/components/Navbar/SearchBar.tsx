import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import Fuse from 'fuse.js';
import Image from 'next/image';

interface Product {
  name: string;
  price: number;
  images: string[];
  showProduct: string;
  normalizedName: string;
}

// Helper function to normalize strings
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [fuse, setFuse] = useState<Fuse<Product> | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://swish-server.vercel.app/products');
        const data: Product[] = await response.json();

        const normalizedProducts = data.map((product: Product) => ({
          ...product,
          normalizedName: normalizeString(product.name),
        }));
        const filteredProducts = normalizedProducts.filter((product) => product.showProduct === "On");
        setProducts(filteredProducts);
        const fuseInstance = new Fuse(filteredProducts, {
          keys: ['normalizedName'],
          threshold: 0.2,
          distance: 200,
          minMatchCharLength: 2,
          shouldSort: true,
        });
        setFuse(fuseInstance);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() && fuse) {
      const normalizedQuery = normalizeString(value);
      const fuzzyResults = fuse.search(normalizedQuery);
      const filteredSuggestions = fuzzyResults.map((result) => result.item);
      setSuggestions(filteredSuggestions);
      router.push(`/products?q=${encodeURIComponent(value.trim())}`);
    } else {
      setSuggestions([]);
      router.push(`/products`);
    }
  };

  const handleSuggestionClick = (suggestion: Product) => {
    const firstTwoWords = suggestion.name.split(' ').slice(0, 2).join(' ');
    const encodedQuery = encodeURIComponent(firstTwoWords);
    setQuery(firstTwoWords);
    setSuggestions([]);
    router.push(`/products?q=${encodedQuery}`);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      router.push(`/products?q=${encodeURIComponent(query)}`);
      setSuggestions([]);
    }
  };

  const handleSearchButtonClick = () => {
    router.push(`/products?q=${encodeURIComponent(query)}`);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-full mx-auto" ref={wrapperRef}>
  <div className="flex items-center bg-white   rounded-lg border-accent-2px  duration-200">
    <input
      ref={inputRef}
      type="text"
      className="flex-grow px-4 py-3 focus:outline-none text-sm bg-transparent placeholder-gray-500"
      placeholder="Search for products..."
      value={query}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
    />
    <button
      className="p-5  bg-accent text-white  border-accent"
      onClick={handleSearchButtonClick}
    >
      <FaSearch className="w-4 h-4" />
    </button>
  </div>
  {suggestions.length > 0 && (
    <div className="absolute w-full bg-white border border-accent mt-1 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
      <ul className="divide-y divide-gray-100">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <div className="flex-shrink-0">
              <Image
                src={suggestion.images[0]}
                alt={suggestion.name}
                className="object-cover border border-gray-200 rounded"
                width={48}
                height={48}
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{suggestion.name}</p>
              <p className="text-sm text-gray-600 font-medium">৳{suggestion.price} BDT</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
  );
};

export default SearchBar;