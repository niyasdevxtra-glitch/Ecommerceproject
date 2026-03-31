import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function Banner({ banner, className = '', priority = false }) {
    if (!banner || !banner.src) return null;

    // Directory-Aware Filter
    let rawPath = banner.src?.toString() || "";
    let cleanPath = rawPath.replace("http://localhost:3001", "").replace(/^\/+/, "");

    // FORCE UPLOADS DIRECTORY: If the path doesn't start with 'uploads', add it.
    if (!cleanPath.startsWith("uploads")) {
        cleanPath = `uploads/${cleanPath}`;
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "http://localhost:3001";
    const finalBannerSrc = `${baseUrl}/${cleanPath}`;

    const innerContent = (
        <>
            {/* Visual Media */}
            {banner.type === 'video' ? (
                <video
                    src={finalBannerSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
            ) : (
                <img
                    src={finalBannerSrc}
                    alt={banner.title || 'Product Promo Banner'}
                    loading={priority ? "eager" : "lazy"}
                    fetchpriority={priority ? "high" : "auto"}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
            )}

            {/* Gradient Overlay for better text readability */}
            {(banner.title || banner.subtitle) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            )}

            {/* Text Content Overlay */}
            {(banner.title || banner.subtitle) && (
                <div className="absolute inset-x-4 bottom-4 md:inset-x-8 md:bottom-8 p-4 md:p-8 transition-all duration-500 translate-y-2 group-hover:translate-y-0 z-10">
                    <div className="max-w-xl">
                        {banner.highlight && (
                            <span className="inline-block px-3 py-1 bg-accent/90 text-black text-[10px] md:text-xs font-black uppercase tracking-widest rounded-full mb-2 md:mb-4 shadow-lg">
                                {banner.highlight}
                            </span>
                        )}
                        {banner.title && (
                            <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-1 md:mb-3 drop-shadow-md">
                                {banner.title}
                            </h2>
                        )}
                        {banner.subtitle && (
                            <p className="text-xs md:text-base text-white/90 font-medium mb-3 md:mb-6 line-clamp-2 drop-shadow-md">
                                {banner.subtitle}
                            </p>
                        )}
                        <span className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl border border-white/30 text-white text-xs md:text-sm font-bold bg-black/50 md:bg-white/20 md:border-white/40 md:backdrop-blur-md hover:bg-black md:hover:bg-white/30 transition-all backdrop-blur-md md:shadow-lg">
                            Buy Now <ArrowUpRight size={14} />
                        </span>
                    </div>
                </div>
            )}
        </>
    );

    const containerClasses = `relative overflow-hidden group bg-zinc-950 ${className}`;

    return banner.link ? (
        <Link to={banner.link} className={`block ${containerClasses}`}>
            {innerContent}
        </Link>
    ) : (
        <div className={containerClasses}>
            {innerContent}
        </div>
    );
}
