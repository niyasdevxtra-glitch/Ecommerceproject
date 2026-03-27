import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Banner from "./Banner";

export default function Newlylaunched() {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const controller = new AbortController();
        const fetchBanners = async () => {
            try {
                const res = await API.get('/api/banners', { signal: controller.signal });
                if (res.data.success) {
                    setBanners(res.data.banners.filter(b => b.category === 'new_launch'));
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

    if (banners.length === 0) return null;

    return (
        <div className="max-w-7xl mx-auto px-6 my-20">
            <div className="flex items-center mb-10 pl-2 md:pl-4">
                <div>
                    <h2 className="text-xl md:text-2xl text-black font-black leading-none mb-1">
                        Latest Launches
                    </h2>
                    <p className="text-gray-500 text-sm font-medium">Curated for the future of tech</p>
                </div>
            </div>

            <Swiper
                modules={[Autoplay]}
                spaceBetween={30}
                slidesPerView={2} 
                loop={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                breakpoints={{
                    0: { slidesPerView: 1, spaceBetween: 20 },    
                    768: { slidesPerView: 2, spaceBetween: 30 },  
                }}
                className="pb-12 !px-4"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner._id}>
                        <Banner banner={banner} className="w-full h-[250px] md:h-[320px] rounded-[2.5rem] overflow-hidden" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}