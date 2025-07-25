import { useState, useEffect } from 'react';
import api from '../api';
import ServiceCard from '../components/ServiceCard';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/bookings/services');
        setServices(res.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <div className="text-center p-10"><span className="loading loading-lg"></span></div>;

  return (
    <div className="container mx-auto p-4">
        <div className="hero min-h-[40vh] bg-base-100 rounded-box mb-8">
            <div className="hero-content text-center">
                <div className="max-w-md">
                <h1 className="text-5xl font-bold">Services at Your Doorstep</h1>
                <p className="py-6">Find and book trusted home services, from cleaning to repairs, all in one place.</p>
                </div>
            </div>
        </div>

      <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(service => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default Home;