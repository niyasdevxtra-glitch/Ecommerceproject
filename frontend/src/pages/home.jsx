import React, { useState, useEffect } from 'react'
import Navbar from '../components/layout/navbar'
import BannerSlider from '../components/layout/bannerslider'
import Categorys from '../components/layout/categorys'
import Footer from '../components/layout/footer'
import Productwithbanner from '../components/layout/productwithbanner'
import Newlylaunched from '../components/layout/newlylaunched'
import API from '../services/api'

function Home() {
  const [topBanners, setTopBanners] = useState([]);
  const [categoryBanners, setCategoryBanners] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    
    API.get('/api/banners', { signal: controller.signal }).then(res => {
      if (res.data.success) {
        setTopBanners(res.data.banners.filter(b => b.category === 'top'));
        setCategoryBanners(res.data.banners.filter(b => b.category === 'category_section'));
      }
    }).catch(err => {
      if (err.name !== 'CanceledError') {
        console.error("Failed to load banners:", err);
      }
    });

    return () => controller.abort();
  }, []);

  return (
    <div>
    <Navbar />
    <BannerSlider />
    <Categorys />
    <Newlylaunched/>
    
    {topBanners.map((banner, index) => (
      <Productwithbanner key={banner._id} banner={banner} priority={index === 0} />
    ))}

    {categoryBanners.map(banner => (
      <Productwithbanner key={banner._id} banner={banner} />
    ))}

    <Footer/>
    </div>
  )
}

export default Home
