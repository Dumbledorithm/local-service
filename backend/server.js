import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

// Import Models
import Message from './models/Message.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (bookingId) => {
    socket.join(bookingId);
    console.log(`User ${socket.id} joined room: ${bookingId}`);
  });

  // This is the updated 'send_message' event handler
  socket.on('send_message', async (data) => {
    try {
      // 1. Save the incoming message to the database
      const newMessage = new Message({
        booking: data.booking,
        sender: data.sender,
        receiver: data.receiver,
        content: data.content,
      });
      let savedMessage = await newMessage.save();

      // 2. Populate the sender's name from the User collection
      savedMessage = await savedMessage.populate('sender', 'name');

      // 3. Broadcast the complete, saved message to everyone in the room
      io.in(data.booking).emit('receive_message', savedMessage);

    } catch (error) {
      console.error("Error handling message: ", error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server (with chat) started on port ${PORT}`));
