import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import ChatModal from '../components/ChatModal';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  const openChat = (booking) => {
    setSelectedBooking(booking);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedBooking(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed': return <div className="badge badge-success text-success-content font-medium">{status}</div>;
      case 'Pending': return <div className="badge badge-warning text-warning-content font-medium">{status}</div>;
      case 'Rejected': return <div className="badge badge-error text-error-content font-medium">{status}</div>;
      case 'Completed': return <div className="badge badge-info text-info-content font-medium">{status}</div>;
      default: return <div className="badge badge-ghost">{status}</div>;
    }
  };

  if (loading) return <div className="text-center p-10"><span className="loading loading-lg text-primary"></span></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <div className="bg-base-100 min-h-[85vh] -mt-20 pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-display font-bold text-main-orange mb-8">My Bookings</h1>
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto shadow-xl rounded-box">
            <table className="table w-full text-base">
              {/* ... table head ... */}
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id} className="hover">
                    <td className="font-semibold text-main-black">{booking.service?.name || 'N/A'}</td>
                    <td>
                      <div className="text-main-black">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                      <div className="text-sm text-main-black">{new Date(booking.bookingDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="whitespace-normal text-main-black">{booking.address}</td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td className="font-bold text-main-black">${booking.service?.price || 'N/A'}</td>
                    <td>
                      {booking.status === 'Confirmed' && (
                        <button onClick={() => openChat(booking)} className="btn manual-btn-primary btn-sm">
                          Chat
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {bookings.length > 0 ? (
              bookings.map(booking => (
                <div key={booking._id} className="card bg-neutral-light shadow-lg">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <h2 className="card-title text-main-black">{booking.service?.name || 'N/A'}</h2>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="text-main-black font-bold">${booking.service?.price || 'N/A'}</p>
                    <div className="text-sm text-main-black mt-2">
                      <p>{new Date(booking.bookingDate).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'})}</p>
                      <p className="mt-1">{booking.address}</p>
                    </div>
                    <div className="card-actions justify-end mt-4">
                      {booking.status === 'Confirmed' && (
                        <button onClick={() => openChat(booking)} className="btn manual-btn-primary btn-sm">
                          Chat with Provider
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center p-8 text-main-black">You have no incoming bookings.</p>
            )}
          </div>
        </div>
      </div>
      {isChatOpen && <ChatModal booking={selectedBooking} onClose={closeChat} />}
    </>
  );
};

export default MyBookings;
