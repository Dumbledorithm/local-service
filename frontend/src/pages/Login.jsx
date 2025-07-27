import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.token);
      navigate('/');
    } catch (error) {
      console.error(error.response.data);
      alert('Login failed! Please check your credentials.');
    }
  };

  return (
    <div className="hero min-h-[80vh]">
      <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-neutral-light">
        <form className="card-body" onSubmit={handleSubmit}>
          <h2 className="card-title text-3xl font-display font-bold text-main-orange">Welcome Back!</h2>
          <div className="form-control">
            <label className="label"><span className="label-text text-main-orange">Email</span></label>
            <input type="email" name="email" placeholder="email" className="input input-bordered" required onChange={handleChange} />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-main-orange">Password</span></label>
            <input type="password" name="password" placeholder="password" className="input input-bordered" required onChange={handleChange} />
            <label className="label">
              <span className="label-text-alt text-main-black">Don't have an account? <Link to="/register" className="link link-primary">Register</Link></span>
            </label>
          </div>
          <div className="form-control mt-6">
            <button className="btn manual-btn-primary" type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;