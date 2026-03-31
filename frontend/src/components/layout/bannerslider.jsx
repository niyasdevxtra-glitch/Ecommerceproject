import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchBanners = async () => {
      try {
        const res = await API.get('/api/banners', { signal: controller.signal });
        if (res.data.success) {
          setBanners(res.data.banners.filter(b => b.category === 'main'));
        }
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error("Failed to fetch banners:", error);
        }
      }
    };
    fetchBanners();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const currentBanner = banners[current];
    const delay = currentBanner?.type === "video" ? 20000 : 7000;

    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, delay);

    return () => clearTimeout(timer);
  }, [current, banners]);

  if (banners.length === 0) return null;

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[480px] overflow-hidden group bg-black">
      {banners.map((banner, index) => {
        const isActive = index === current;
        
        return (
          <div 
            key={banner._id} 
            className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isActive ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-110 translate-x-10 pointer-events-none"
            }`}
          >
            {/* Background */}
            {banner.type === "video" ? (
              <video
                src={banner.src}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
            ) : (
              <img
                src={banner.src}
                alt={banner.title || "Hero Banner"}
                loading={index === 0 ? "eager" : "lazy"}
                fetchpriority={index === 0 ? "high" : "auto"}
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

            {/* Content Container */}
            <div className="relative z-10 flex items-center h-full px-6 md:px-20 max-w-7xl mx-auto">
              <div className={`max-w-2xl transition-all duration-1000 delay-300 ${isActive ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                {banner.highlight && (
                   <span className="inline-block px-3 py-1 bg-accent/20 border border-accent/30 text-accent text-[9px] sm:text-xs font-black tracking-[0.15em] rounded-full mb-4 uppercase">
                    {banner.highlight}
                  </span>
                )}
                
                <h1 className="text-white font-black leading-[1.1] mb-3 md:mb-6 drop-shadow-2xl text-lg sm:text-4xl md:text-7xl">
                  {banner.title}
                </h1>

                {banner.subtitle && (
                  <p className="text-white/80 text-xs sm:text-sm md:text-xl font-medium mb-6 md:mb-10 max-w-lg leading-relaxed mix-blend-screen">
                    {banner.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center z-30">
        <div className="flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                current === index ? "w-8 bg-accent" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
      

    </div>
  );
}
