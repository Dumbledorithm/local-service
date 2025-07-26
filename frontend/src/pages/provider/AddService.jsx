import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';

const AddService = () => {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', imageUrl: '' });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/services', formData);
      alert('Service added successfully!');
      navigate('/provider/dashboard');
    } catch (error) {
      console.error(error.response.data);
      alert('Failed to add service.');
    }
  };

  if (!user || user.role !== 'provider') return <Navigate to="/" replace />;

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl font-display font-bold mb-6">Add a New Service</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" onChange={handleChange} placeholder="Service Name" className="input input-bordered w-full" required />
            <textarea name="description" onChange={handleChange} placeholder="Description" className="textarea textarea-bordered w-full" required />
            <input name="price" type="number" onChange={handleChange} placeholder="Price ($)" className="input input-bordered w-full" required />
            <input name="category" onChange={handleChange} placeholder="Category (e.g., Cleaning)" className="input input-bordered w-full" required />
            <input name="imageUrl" onChange={handleChange} placeholder="Image URL" className="input input-bordered w-full" required />
            <button type="submit" className="btn btn-primary w-full mt-4">Add Service</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddService;