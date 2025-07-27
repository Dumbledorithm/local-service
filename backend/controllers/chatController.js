import Message from '../models/Message.js';



/**
 * @desc    Save a new chat message
 * @route   POST /api/chat/:bookingId
 * @access  Private
 */
export const saveMessage = async (req, res) => {
  const { booking, sender, receiver, content } = req.body;

  try {
    const newMessage = new Message({
      booking,
      sender,
      receiver,
      content,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Get all messages for a specific booking
 * @route   GET /api/chat/:bookingId
 * @access  Private
 */
export const getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find({ booking: req.params.bookingId })
      .populate('sender', 'name')
      .sort({ createdAt: 'asc' });
    
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
