import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import Banner from "./Banner";
import ProductCard from "../common/ProductCard";

/* ─────────────── Product Grid (Adaptive) ─────────────── */
const ProductGrid = ({ category }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const url = category ? `/api/products?category=${encodeURIComponent(category)}` : "/api/products";
    
    API.get(url, { signal: controller.signal })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setProducts(res.data.slice(0, 5)); // Initial slice for demo
        }
      })
      .catch((err) => {
        if (err.name !== 'CanceledError') {
          console.error("Failed to load products:", err);
        }
      });
      
    return () => controller.abort();
  }, [category]);

  if (products.length === 0) return (
     <div className="flex overflow-x-auto gap-4 md:gap-6 mt-8 pb-6 scrollbar-hide">
        {[1,2,3,4,5].map(i => (
            <div key={i} className="w-[200px] md:w-[280px] shrink-0 aspect-[4/5] bg-gray-100 animate-pulse rounded-3xl" />
        ))}
     </div>
  );

  return (
    <div className="flex overflow-x-auto gap-4 md:gap-6 mt-8 pb-6 scrollbar-hide snap-x snap-mandatory">
      {products.map((product) => (
        <div key={product._id} className="w-[200px] md:w-[280px] shrink-0 snap-start">
            <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

/* ─────────────── Main Component ─────────────── */
export default function ProductWithBanner({ banner, priority = false }) {
  if (!banner) return null;

  return (
    <section className="pt-10 pb-2 md:pt-16 md:pb-6 px-4 md:px-10 max-w-7xl mx-auto border-b border-gray-100">
      <div className="mb-8">
        <Banner banner={banner} priority={priority} className="w-full h-[150px] sm:h-[180px] md:h-[280px] rounded-3xl md:rounded-[3rem] shadow-2xl" />
      </div>

      <ProductGrid category={banner.productCategory} />
    </section>
  );
}
