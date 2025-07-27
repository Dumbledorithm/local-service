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

  const navLinks = (
    <>
      <li><Link to="/">Home</Link></li>
      {user?.role === 'provider' && (
        <>
          <li><Link to="/provider/dashboard">My Services</Link></li>
          <li><Link to="/provider/bookings">My Bookings</Link></li>
        </>
      )}
      {user?.role === 'user' && <li><Link to="/my-bookings">My Bookings</Link></li>}
    </>
  );

  return (
    <div className="navbar bg-base-100/70 backdrop-blur-lg border border-gray-200 rounded-full shadow-sm h-14 min-h-0">
      
      {/* Logo */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-bold">
          <span className="font-display text-main-orange">Service</span>
          <span className="font-display text-main-black italic">pro</span>
        </Link>
      </div>

      {/* Desktop Menu (hidden on mobile) */}
      <div className="flex-none hidden lg:flex">
        <ul className="menu menu-horizontal items-center space-x-2 p-0">
          {navLinks}
        </ul>
      </div>

      {/* Auth Buttons & Mobile Menu */}
      <div className="flex-none">
        <ul className="menu menu-horizontal items-center space-x-2 p-0">
          {user ? (
            <li>
              <button onClick={handleLogout} className="btn manual-btn-primary btn-sm">
                Logout
              </button>
            </li>
          ) : (
            <>
              <li className="hidden sm:flex"><Link to="/login" className="btn btn-ghost btn-sm">Login</Link></li>
              <li><Link to="/register" className="btn manual-btn-primary btn-sm">Register</Link></li>
            </>
          )}

          {/* Mobile Dropdown Menu */}
          <div className="dropdown dropdown-end lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              {navLinks}
              {!user && <li><Link to="/login">Login</Link></li>}
            </ul>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
