import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getServices, createBooking, getMyBookings } from '../controllers/bookingController.js';

const router = express.Router();

router.get('/services', getServices);
router.post('/', authMiddleware, createBooking);
router.get('/my-bookings', authMiddleware, getMyBookings);

export default router;