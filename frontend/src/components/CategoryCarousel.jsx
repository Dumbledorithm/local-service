import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import cleaningIcon from '../assets/category-cleaning.png';
import repairIcon from '../assets/category-repair.png';
import plumbingIcon from '../assets/category-plumbing.png';
import paintingIcon from '../assets/category-painting.png';
import allIcon from '../assets/category-all.png';

const categoryData = [
    { name: "All", icon: allIcon },
    { name: "Cleaning", icon: cleaningIcon },
    { name: "Repair", icon: repairIcon },
    { name: "Plumbing", icon: plumbingIcon },
    { name: "Painting", icon: paintingIcon },
];

const CategoryCarousel = ({ setSelectedCategory, selectedCategory }) => {
  return (
    <div className="container mx-auto my-12">
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={2}
        navigation
        breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
        }}
        className="pb-2"
      >
        {categoryData.map(({ name, icon }) => (
          <SwiperSlide key={name} >
            <div 
              onClick={() => setSelectedCategory(name)}
              className={`card card-compact cursor-pointer transition-all duration-300 ${selectedCategory === name ? 'bg-neutral-light text-main-black ' : 'bg-base-100 shadow'}`}
            >
              <div className="card-body items-center text-center text-main-black p-4">
                <img src={icon} alt={name} className="w-10 h-10" />
                <h2 className="font-display text-base mt-2">{name}</h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryCarousel;