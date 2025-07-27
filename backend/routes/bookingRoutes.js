import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { 
    getServices, 
    createBooking, 
    getMyBookings,
    manageBooking,
    getProviderBookings 
} from '../controllers/bookingController.js';


const router = express.Router();

router.get('/services', getServices);
router.get('/my-bookings', authMiddleware, getMyBookings);
router.post('/', authMiddleware, createBooking);
router.get('/manage/:token', manageBooking);

const providerMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'provider') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Providers only.' });
  }
};

router.get('/provider-bookings', authMiddleware, providerMiddleware, getProviderBookings);

export default router;