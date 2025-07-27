import jwt from 'jsonwebtoken';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

/**
 * @desc    Get all services for the homepage
 * @route   GET /api/bookings/services
 * @access  Public
 */
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().populate('provider', 'name');
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Get all bookings for a logged-in user
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      // This nested populate is the key fix.
      // It gets the service, and FOR that service, it gets the provider's details.
      .populate({ 
        path: 'service', 
        populate: { path: 'provider', model: 'User', select: 'name' } 
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Create a new booking request
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = async (req, res) => {
  const { serviceId, bookingDate, address } = req.body;

  if (!serviceId || !bookingDate || !address) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

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
      address,
      status: 'Pending',
    });
    
    const booking = await newBooking.save();

    // Helper to create unique tokens for management links
    const generateActionToken = (action) => {
        return jwt.sign({ bookingId: booking._id, action }, process.env.JWT_SECRET, { expiresIn: '7d' });
    };
    
    const acceptToken = generateActionToken('confirm');
    const rejectToken = generateActionToken('reject');

    const acceptUrl = `http://localhost:5000/api/bookings/manage/${acceptToken}`;
    const rejectUrl = `http://localhost:5000/api/bookings/manage/${rejectToken}`;

    // Construct the email to be sent to the service provider
    const emailHtml = `
      <h1>New Booking Request</h1>
      <p>Hello ${service.provider.name},</p>
      <p>You have a new booking request for your service: <strong>${service.name}</strong> from customer <strong>${customer.name}</strong>.</p>
      <hr>
      <h3>Booking Details:</h3>
      <p><b>Date:</b> ${new Date(bookingDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
      <p><b>Time:</b> ${new Date(bookingDate).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}</p>
      <p><b>Address:</b> ${address}</p>
      <hr>
      <p>Please accept or reject the booking by clicking one of the buttons below:</p>
      <a href="${acceptUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accept Booking</a>
      <a href="${rejectUrl}" style="background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-left: 10px;">Reject Booking</a>
    `;

    // Send the email using the utility
    await sendEmail({
      to: service.provider.email,
      subject: `New Booking Request for ${service.name} from ServicePro`,
      html: emailHtml,
    });
    
    res.status(201).json({ message: 'Booking request sent. Awaiting provider confirmation.', booking });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Manage a booking (Accept/Reject) via email link
 * @route   GET /api/bookings/manage/:token
 * @access  Public (but token-secured)
 */
export const manageBooking = async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const { bookingId, action } = decoded;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).send('<h1>Error 404: Booking not found.</h1><p>This may have been cancelled.</p>');
        }

        if (booking.status !== 'Pending') {
             return res.status(400).send(`<h1>Action Already Taken</h1><p>This booking has already been ${booking.status.toLowerCase()}.</p>`);
        }

        booking.status = action === 'confirm' ? 'Confirmed' : 'Rejected';
        await booking.save();
        
        // Optionally, you could trigger another email here to notify the *user* of the status change.
        
        res.send(`<h1>Booking successfully ${booking.status}!</h1><p>You can now close this window.</p>`);

    } catch (error) {
        console.error(error);
        res.status(400).send('<h1>Error</h1><p>This confirmation link is either invalid or has expired.</p>');
    }
};

/**
 * @desc    Get all bookings for a logged-in provider
 * @route   GET /api/bookings/provider-bookings
 * @access  Private (Provider only)
 */
export const getProviderBookings = async (req, res) => {
  try {
    // Find all services offered by the current provider
    const services = await Service.find({ provider: req.user.id });
    const serviceIds = services.map(s => s._id);

    // Find all bookings that are for any of those services
    const bookings = await Booking.find({ service: { $in: serviceIds } })
      .populate('service', 'name')
      .populate('user', 'name') // Populate the customer's name
      .sort({ createdAt: -1 });
      
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};