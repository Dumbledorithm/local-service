import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

export const getServices = async (req, res) => {
  try {
    const services = await Service.find().populate('provider', 'name');
    res.json(services);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

export const createBooking = async (req, res) => {
  const { serviceId, bookingDate } = req.body;
  try {
    const newBooking = new Booking({
      user: req.user.id,
      service: serviceId,
      bookingDate,
    });
    const booking = await newBooking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('service', 'name price');
    res.json(bookings);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};