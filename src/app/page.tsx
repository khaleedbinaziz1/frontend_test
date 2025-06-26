'use client';

import React, { Suspense } from 'react';
import Hero1 from '../components/Hero/Hero1';
import TopCategories1 from '../components/topCategories/TopCategories1';
import ProductSection1 from '../components/ProductSection/ProductSection1';

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <Hero1 heroPreviews={["/images/hero/hero-1.png", "/images/hero/hero-2.png", "/images/hero/hero-3.png"]} />
        <TopCategories1 />
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductSection1 />
        </Suspense>
      </main>
    </div>
  );
}
