import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      const fetchBookings = async () => {
        try {
          const res = await api.get('/bookings/my-bookings');
          setBookings(res.data);
        } catch (error) {
          console.error('Failed to fetch bookings:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) return <div className="text-center p-10"><span className="loading loading-lg"></span></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <div className="overflow-x-auto bg-base-100 rounded-box shadow-lg">
        <table className="table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? bookings.map(booking => (
              <tr key={booking._id} className="hover">
                <td>{booking.service?.name || 'Service Not Found'}</td>
                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td><span className="badge badge-success badge-outline">{booking.status}</span></td>
                <td>${booking.service?.price || 'N/A'}</td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="text-center p-4">You have no bookings.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookings;