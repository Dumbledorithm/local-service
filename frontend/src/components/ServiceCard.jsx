import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const ServiceCard = ({ service }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State to manage the visibility of the booking modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to hold the form data for the booking
  const [bookingDetails, setBookingDetails] = useState({ address: '', date: '', time: '' });

  // Updates the form state as the user types
  const handleInputChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  // Handles the final booking submission from the modal form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        alert('Please log in to book a service.');
        navigate('/login');
        return;
    }
    if (user.role === 'provider') {
        alert('Providers cannot book services.');
        return;
    }

    // Combine the separate date and time strings into a single valid Date object
    const bookingDateTime = new Date(`${bookingDetails.date}T${bookingDetails.time}`);

    try {
      await api.post('/bookings', {
        serviceId: service._id,
        bookingDate: bookingDateTime,
        address: bookingDetails.address,
      });

      alert('Booking request sent successfully! You can check its status on the My Bookings page.');
      setIsModalOpen(false); // Close the modal on success
      navigate('/my-bookings');

    } catch (error) {
      console.error('Booking failed:', error.response?.data?.message || 'An error occurred.');
      alert('Failed to send booking request. Please ensure all fields are filled correctly.');
    }
  };

  return (
    // Use a React Fragment to render the card and modal as siblings
    <>
      {/* The Service Card itself with scroll animation */}
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
            <p className="text-lg font-bold text-main-black">${service.price}</p>
            {/* This button now opens the modal instead of booking directly */}
            <button onClick={() => user ? setIsModalOpen(true) : navigate('/login')} className="btn manual-btn-primary">
              Book Now
            </button>
          </div>
        </div>
      </motion.div>

      {/* --- Booking Modal --- */}
      <dialog id={`booking_modal_${service._id}`} className="modal bg-neutral-light" open={isModalOpen}>
        <div className="modal-box">
          <h3 className="font-bold text-2xl font-display text-main-orange">Book: {service.name}</h3>
          
          <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
            <div>
              <label className="label"><span className="label-text text-main-orange">Service Address</span></label>
              <textarea 
                name="address" 
                required 
                className="textarea textarea-bordered w-full" 
                placeholder="Enter the full address for the service in Lucknow" 
                onChange={handleInputChange}
                value={bookingDetails.address}
              ></textarea>
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="label"><span className="label-text text-main-orange">Date</span></label>
                    <input 
                      name="date" 
                      type="date" 
                      required 
                      className="input input-bordered w-full" 
                      onChange={handleInputChange} 
                      value={bookingDetails.date}
                    />
                </div>
                <div className="flex-1">
                    <label className="label"><span className="label-text text-main-orange">Time</span></label>
                    <input 
                      name="time" 
                      type="time" 
                      required 
                      className="input input-bordered w-full" 
                      onChange={handleInputChange} 
                      value={bookingDetails.time}
                    />
                </div>
            </div>
            <div className="modal-action mt-6">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn">Cancel</button>
              <button type="submit" className="btn manual-btn-primary">Send Request</button>
            </div>
          </form>
        </div>
        {/* Click outside the modal to close */}
        <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsModalOpen(false)}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default ServiceCard;