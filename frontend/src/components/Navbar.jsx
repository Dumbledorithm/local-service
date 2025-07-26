import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4 md:px-8">
      {/* Logo on the left (takes up remaining space) */}
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-primary font-logo">
          ServicePro
        </Link>
      </div>

      {/* All navigation items grouped in a single container on the right */}
      <div className="flex-none">
        <ul className="menu menu-horizontal items-center space-x-2 p-0">
          <li><Link to="/">Home</Link></li>
          
          {/* Conditional links based on login status */}
          {user ? (
            <>
              {user.role === 'provider' && <li><Link to="/provider/dashboard">Dashboard</Link></li>}
              {user.role === 'user' && <li><Link to="/my-bookings">My Bookings</Link></li>}
              <li><button onClick={handleLogout} className="btn btn-primary">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="btn btn-ghost">Login</Link></li>
              <li><Link to="/register" className="btn btn-primary">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;