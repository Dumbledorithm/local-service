import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
      await api.post('/bookings', {
        serviceId: service._id,
        bookingDate: new Date(),
      });
      alert('Service booked successfully!');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to book service.');
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure><img src={service.imageUrl || 'https://via.placeholder.com/400x225'} alt={service.name} className="h-56 w-full object-cover" /></figure>
      <div className="card-body">
        <h2 className="card-title">{service.name}</h2>
        <p>{service.description}</p>
        <div className="card-actions justify-between items-center mt-4">
          <p className="text-lg font-semibold">${service.price}</p>
          <button onClick={handleBookNow} className="btn btn-primary">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;