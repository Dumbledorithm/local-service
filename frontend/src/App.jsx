
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderBookings from './pages/provider/ProviderBookings.jsx';
import AddService from './pages/provider/AddService';
import { Toaster } from 'react-hot-toast'; 
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
      <header className="px-4 pt-4 z-50">
        <div className="container mx-auto"> 
          <Navbar />
        </div>
      </header>
        <div className="flex flex-col min-h-screen bg-neutral/50 font-sans text-primary">
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/provider/dashboard" element={<ProviderDashboard />} />
               <Route path="/provider/bookings" element={<ProviderBookings />} />
              <Route path="/provider/add-service" element={<AddService />} />
            </Routes>
          </main>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              success: {
                style: {
                  background: '#dcfce7', // A light green
                  color: '#166534',      // A dark green
                },
              },
              error: {
                style: {
                  background: '#fee2e2', // A light red
                  color: '#991b1b',      // A dark red
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 


