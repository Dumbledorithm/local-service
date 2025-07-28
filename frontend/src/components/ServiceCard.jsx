import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const ServiceCard = ({ service }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ address: '', date: '', time: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get today's date in YYYY-MM-DD format to set the minimum selectable date on the input
  const today = new Date().toISOString().split('T')[0];

  const handleInputChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        toast.error('Please log in to book a service.');
        navigate('/login');
        return;
    }
    if (user.role === 'provider') {
        toast.error('Providers cannot book services.');
        return;
    }

    const selectedDateTime = new Date(`${bookingDetails.date}T${bookingDetails.time}`);
    
    // Frontend validation to check if the selected date is in the past
    if (selectedDateTime < new Date()) {
      toast.error('You cannot book a service in the past. Please select a future date and time.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/bookings', {
        serviceId: service._id,
        bookingDate: selectedDateTime,
        address: bookingDetails.address,
      });
      toast.success('Booking request sent successfully! You can check its status on the My Bookings page.');
      setIsModalOpen(false);
      navigate('/my-bookings');
    } catch (error) {
      // Display specific error message from the backend if available (e.g., "Provider is already booked")
      const errorMessage = error.response?.data?.message || 'Failed to send booking request. Please ensure all fields are filled correctly.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="card rounded-2xl card-bg-light-grey shadow-lg h-full"
      >
        <figure><img src={service.imageUrl} alt={service.name} className="h-56 w-full object-cover" /></figure>
        <div className="card-body">
          <h2 className="card-title font-display text-main-orange">{service.name}</h2>
          <p className="text-main-black flex-grow">{service.description}</p>
          <div className="card-actions justify-between items-center mt-4">
            <p className="text-lg font-bold text-main-black">Rs.{service.price}</p>
            <button onClick={() => user ? setIsModalOpen(true) : navigate('/login')} className="btn manual-btn-primary rounded-xl">
              Book Now
            </button>
          </div>
        </div>
      </motion.div>

      {/* --- Booking Modal --- */}
      <dialog id={`booking_modal_${service._id}`} className="modal" open={isModalOpen}>
        <div className="modal-box rounded-2xl">
          <h3 className="font-bold text-2xl font-display text-main-orange">Book: {service.name}</h3>
          
          <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
            <div>
              <label className="label"><span className="label-text text-main-orange">Service Address</span></label>
              <textarea 
                name="address" 
                required 
                className="textarea textarea-bordered w-full rounded-xl" 
                placeholder="Enter the full address for the service in Lucknow" 
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="label"><span className="label-text text-main-orange">Date</span></label>
                    <input 
                      name="date" 
                      type="date" 
                      required 
                      min={today} 
                      className="input input-bordered w-full rounded-xl" 
                      onChange={handleInputChange} 
                    />
                </div>
                <div className="flex-1">
                    <label className="label"><span className="label-text text-main-orange">Time</span></label>
                    <input 
                      name="time" 
                      type="time" 
                      required 
                      className="input input-bordered w-full rounded-xl" 
                      onChange={handleInputChange} 
                    />
                </div>
            </div>
            
            <div className="modal-action mt-6">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn rounded-xl">Cancel</button>
              <button type="submit" className="btn manual-btn-primary rounded-xl" disabled={isSubmitting}>
                {isSubmitting && <span className="loading loading-spinner"></span>}
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsModalOpen(false)}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default ServiceCard;
