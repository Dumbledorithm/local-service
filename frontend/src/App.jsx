import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import AddService from './pages/provider/AddService';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-base-200/50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Routes */}
              <Route path="/my-bookings" element={<MyBookings />} />

              {/* Provider Routes */}
              <Route path="/provider/dashboard" element={<ProviderDashboard />} />
              <Route path="/provider/add-service" element={<AddService />} />
            </Routes>
          </main>
          <footer className="footer footer-center p-4 bg-base-300 text-base-content">
            <aside><p>Copyright © 2025 - All right reserved by ServicePro Ltd</p></aside>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;