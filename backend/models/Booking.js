import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  bookingDate: { type: Date, required: true },
  // Add this new address field
  address: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Rejected', 'Completed'],
    default: 'Pending'
  },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);