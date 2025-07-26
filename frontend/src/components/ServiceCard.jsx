import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const ServiceCard = ({ service }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBookNow = async () => {
    if (!user) {
      alert('Please log in to book a service.');
      navigate('/login');
      return;
    }
    if (user.role === 'provider') {
      alert('Providers cannot book services.');
      return;
    }
    try {
      await api.post('/bookings', { serviceId: service._id, bookingDate: new Date() });
      alert('Service booked successfully!');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to book service.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="card bg-base-100 shadow-lg"
    >
      <figure><img src={service.imageUrl} alt={service.name} className="h-56 w-full object-cover" /></figure>
      <div className="card-body">
        <h2 className="card-title font-display">{service.name}</h2>
        <p className="text-secondary/70">{service.description}</p>
        <div className="card-actions justify-between items-center mt-4">
          <p className="text-lg font-bold text-secondary">${service.price}</p>
          <button onClick={handleBookNow} className="btn btn-primary">Book Now</button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;