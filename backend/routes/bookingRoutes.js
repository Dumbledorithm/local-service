import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { 
    getServices, 
    createBooking, 
    getMyBookings,
    manageBooking 
} from '../controllers/bookingController.js';

const router = express.Router();

router.get('/services', getServices);
router.get('/my-bookings', authMiddleware, getMyBookings);
router.post('/', authMiddleware, createBooking);
router.get('/manage/:token', manageBooking);

export default router;