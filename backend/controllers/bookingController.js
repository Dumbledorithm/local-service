import jwt from 'jsonwebtoken';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

export const getServices = async (req, res) => {
  try {
    const services = await Service.find().populate('provider', 'name');
    res.json(services);
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

export const createBooking = async (req, res) => {
  const { serviceId, bookingDate } = req.body;
  try {
    const service = await Service.findById(serviceId).populate('provider');
    const customer = await User.findById(req.user.id);

    if (!service || !service.provider) {
      return res.status(404).json({ message: 'Service or provider not found' });
    }

    const newBooking = new Booking({
      user: req.user.id,
      service: serviceId,
      bookingDate,
      status: 'Pending',
    });
    
    const booking = await newBooking.save();

    const generateActionToken = (action) => {
        return jwt.sign({ bookingId: booking._id, action }, process.env.JWT_SECRET, { expiresIn: '7d' });
    };
    const acceptToken = generateActionToken('confirm');
    const rejectToken = generateActionToken('reject');

    const acceptUrl = `http://localhost:5000/api/bookings/manage/${acceptToken}`;
    const rejectUrl = `http://localhost:5000/api/bookings/manage/${rejectToken}`;

    const emailHtml = `
      <h1>New Booking Request</h1>
      <p>Hello ${service.provider.name},</p>
      <p>You have a new booking request for your service: <strong>${service.name}</strong> from customer <strong>${customer.name}</strong>.</p>
      <p>Booking Date: ${new Date(bookingDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
      <p>Please accept or reject the booking by clicking one of the buttons below:</p>
      <a href="${acceptUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accept Booking</a>
      <a href="${rejectUrl}" style="background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-left: 10px;">Reject Booking</a>
    `;

    await sendEmail({
      to: service.provider.email,
      subject: 'New Booking Request from ServicePro',
      html: emailHtml,
    });
    
    res.status(201).json({ message: 'Booking request sent. Awaiting provider confirmation.', booking });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const manageBooking = async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const { bookingId, action } = decoded;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).send('<h1>Booking not found.</h1>');
        }

        if (booking.status !== 'Pending') {
             return res.status(400).send('<h1>This booking has already been managed.</h1>');
        }

        booking.status = action === 'confirm' ? 'Confirmed' : 'Rejected';
        await booking.save();
        
        res.send(`<h1>Booking successfully ${booking.status}!</h1><p>You can now close this window.</p>`);

    } catch (error) {
        res.status(400).send('<h1>Invalid or expired link.</h1>');
    }
};