import { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';

const ProviderDashboard = () => {
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyServices = async () => {
      try {
        const res = await api.get('/services/my-services');
        setMyServices(res.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'provider') {
      fetchMyServices();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div className="text-center p-10"><span className="loading loading-lg"></span></div>;
  if (!user || user.role !== 'provider') return <Navigate to="/" replace />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
        <Link to="/provider/add-service" className="btn btn-primary">Add New Service</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {myServices.length > 0 ? myServices.map(service => (
          <div key={service._id} className="card bg-base-100 shadow-xl">
             <figure><img src={service.imageUrl || 'https://via.placeholder.com/400x225'} alt={service.name} className="h-56 w-full object-cover" /></figure>
            <div className="card-body">
              <h2 className="card-title">{service.name}</h2>
              <p className="font-semibold text-lg">${service.price}</p>
              <p className="text-sm text-gray-500">Category: {service.category}</p>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center p-8 bg-base-100 rounded-box">
            <p>You have not added any services yet. Click 'Add New Service' to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;