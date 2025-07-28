import {Link} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import ServiceCard from '../components/ServiceCard';
import Features from '../components/Features';
import CategoryCarousel from '../components/CategoryCarousel';
import Testimonials from '../components/Testimonials';

import brushStroke from '../assets/brush-stroke.png';
import professionalImg from '../assets/professional.png';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await api.get('/bookings/services');
        setServices(res.data);
      } catch (error) { console.error('Failed to fetch services:', error); }
      setLoading(false);
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="bg-base-100 w-full">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-display font-extrabold text-main-orange leading-tight">
                Services at Your Doorstep
              </h1>
              <p className="mt-6 text-lg text-main-black">
                Find and book trusted home services, from cleaning to repairs, all in one place in Lucknow.
              </p>
              <div className="mt-8 flex gap-4 justify-center md:justify-start">
                <a href="#services-section" className="btn manual-btn-primary rounded-md">Explore Services</a>
                <Link to="/register" className="btn btn-outline manual-btn-primary rounded-md">Become a Provider</Link> 
              </div> 
            </div>
            <div className="relative hidden md:block h-96 lg:h-[28rem]">
              <img src={brushStroke} alt="Brush stroke" className="absolute inset-0 w-full h-full object-contain translate-x-10" />
              <img src={professionalImg} alt="Service professional" className="absolute bottom-16 left-1/2 -translate-x-1/2 h-[95%] object-contain" />
            </div>
          </div>
        </div>
      </div>
      <Features />
      <div id="services-section" className="text-center pt-16 scroll-mt-20">
        <h2 className="text-4xl font-display font-bold text-main-orange">Our Services</h2>
      </div>
      <CategoryCarousel selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
            <input 
              type="text" 
              placeholder="Search within category..." 
              className="input input-bordered w-full max-w-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        {loading ? (
            <div className="text-center p-10"><span className="loading loading-lg"></span></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.length > 0 ? (
                filteredServices.map(service => (
                <ServiceCard key={service._id} service={service} />
                ))
            ) : (
                <p className="col-span-full text-center text-lg text-main-black">No services found.</p>
            )}
            </div>
        )}
      </div>
      <Testimonials />
    </>
  );
};

export default Home;