import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import ChatModal from '../../components/ChatModal';

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (token && user?.role === 'provider') {
      const fetchProviderBookings = async () => {
        try {
          const res = await api.get('/bookings/provider-bookings');
          setBookings(res.data);
        } catch (error) {
          console.error('Failed to fetch provider bookings:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProviderBookings();
    } else {
      setLoading(false);
    }
  }, [token, user]);

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
  if (!user || user.role !== 'provider') return <Navigate to="/login" replace />;

  return (
    <>
      <div className="bg-base-100 min-h-[85vh] -mt-20 pt-24">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-display font-bold text-main-orange mb-8">Incoming Bookings</h1>
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto shadow-xl rounded-box">
            <table className="table w-full text-base">
              {/* ... table head ... */}
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id} className="hover">
                    <td className="font-semibold text-main-orange">{booking.user?.name || 'N/A'}</td>
                    <td className="text-main-black">{booking.service?.name || 'N/A'}</td>
                    <td>
                      <div className="text-main-black">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                      <div className="text-sm text-main-black">{new Date(booking.bookingDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="whitespace-normal text-main-black">{booking.address}</td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td>
                      {booking.status === 'Confirmed' && (
                        <button onClick={() => openChat(booking)} className="btn manual-btn-primary btn-sm">
                          Chat with Customer
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
                      <div>
                        <p className="text-xs">Customer</p>
                        <h2 className="card-title text-main-orange -mt-1">{booking.user?.name || 'N/A'}</h2>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="font-semibold text-main-black">{booking.service?.name || 'N/A'}</p>
                    <div className="text-sm text-main-black mt-2">
                      <p>{new Date(booking.bookingDate).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'})}</p>
                      <p className="mt-1">{booking.address}</p>
                    </div>
                    <div className="card-actions justify-end mt-4">
                      {booking.status === 'Confirmed' && (
                        <button onClick={() => openChat(booking)} className="btn manual-btn-primary btn-sm">
                          Chat with Customer
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

export default ProviderBookings;
