import { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';

const ProviderDashboard = () => {
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.role === 'provider') {
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
      fetchMyServices();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div className="text-center p-10"><span className="loading loading-lg text-primary"></span></div>;
  if (!user || user.role !== 'provider') return <Navigate to="/" replace />;

  return (
    <div className="bg-base-100">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <h1 className="text-4xl font-display font-bold text-secondary">Provider Dashboard</h1>
          <Link to="/provider/add-service" className="btn btn-primary">Add New Service</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myServices.length > 0 ? (
            myServices.map(service => (
              <div key={service._id} className="card bg-neutral/50 shadow-md">
                <figure><img src={service.imageUrl} alt={service.name} className="h-56 w-full object-cover" /></figure>
                <div className="card-body">
                  <h2 className="card-title font-display">{service.name}</h2>
                  <p className="font-semibold text-lg text-secondary">${service.price}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-8 bg-neutral/50 rounded-box">
              <p className="text-secondary/70">You have not added any services yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;