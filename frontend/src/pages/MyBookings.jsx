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

  // Helper function to render a styled badge based on booking status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <div className="badge badge-success text-success-content font-medium">{status}</div>;
      case 'Pending':
        return <div className="badge badge-warning text-warning-content font-medium">{status}</div>;
      case 'Rejected':
        return <div className="badge badge-error text-error-content font-medium">{status}</div>;
      case 'Completed':
         return <div className="badge badge-info text-info-content font-medium">{status}</div>;
      default:
        return <div className="badge badge-ghost">{status}</div>;
    }
  };

  if (loading) {
    return <div className="text-center p-10"><span className="loading loading-lg text-primary"></span></div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-base-100 min-h-[85vh]">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-display font-bold text-secondary mb-8">My Bookings</h1>
        <div className="overflow-x-auto shadow-xl rounded-box">
          <table className="table w-full text-base">
            <thead className="text-base">
              <tr>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map(booking => (
                  <tr key={booking._id} className="hover">
                    <td className="font-semibold text-secondary">{booking.service?.name || 'Service Not Found'}</td>
                    <td>{new Date(booking.bookingDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td className="font-bold text-secondary">${booking.service?.price || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-secondary/70">
                    You have no bookings yet. Explore our services to get started!
                  </td>
</tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;