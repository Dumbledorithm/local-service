import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }
    try {
      const res = await api.post('/auth/register', formData);
      login(res.data.token);
      navigate('/');
    } catch (error) {
      console.error(error.response.data);
      alert('Registration failed! The email might already be in use.');
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <h2 className="card-title text-2xl">Register</h2>
          <div className="form-control">
            <label className="label"><span className="label-text">Name</span></label>
            <input type="text" name="name" placeholder="name" className="input input-bordered" required onChange={handleChange} />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Email</span></label>
            <input type="email" name="email" placeholder="email" className="input input-bordered" required onChange={handleChange} />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Password</span></label>
            <input type="password" name="password" placeholder="password" className="input input-bordered" required minLength="6" onChange={handleChange} />
          </div>
          <div className="form-control mt-4">
            <label className="label"><span className="label-text font-semibold">Register As</span></label>
            <div className="flex gap-6">
               <label className="label cursor-pointer">
                  <span className="label-text mr-2">User</span>
                  <input type="radio" name="role" value="user" className="radio checked:bg-primary" checked={formData.role === 'user'} onChange={handleChange} />
               </label>
               <label className="label cursor-pointer">
                  <span className="label-text mr-2">Provider</span>
                  <input type="radio" name="role" value="provider" className="radio checked:bg-accent" checked={formData.role === 'provider'} onChange={handleChange} />
               </label>
            </div>
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary" type="submit">Register</button>
          </div>
           <label className="label">
              <span className="label-text-alt">Already have an account? <Link to="/login" className="link link-hover">Login</Link></span>
            </label>
        </form>
      </div>
    </div>
  );
};

export default Register;