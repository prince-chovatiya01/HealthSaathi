// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { createServer } from 'http';
// import { Server } from 'socket.io';

// // Route imports
// import userRoutes from './routes/userRoutes.js';
// import doctorRoutes from './routes/doctorRoutes.js';
// import appointmentRoutes from './routes/appointmentRoutes.js';
// import healthRecordRoutes from './routes/healthRecordRoutes.js';
// import chatRoutes from './routes/chatRoutes.js';

// dotenv.config();

// // Handle ES Module __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Initialize app and server
// const app = express();
// const httpServer = createServer(app);

// // Configure Socket.IO
// const io = new Server(httpServer, {
//   cors: {
//     origin: process.env.CLIENT_URL || 'http://localhost:5173',
//     methods: ['GET', 'POST']
//   }
// });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Serve static files (e.g. health record uploads)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('✅ Connected to MongoDB'))
// .catch(err => console.error('❌ MongoDB connection error:', err));

// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/doctors', doctorRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/health-records', healthRecordRoutes);
// app.use('/api/chat', chatRoutes);

// // Socket.IO Real-Time Chat Events
// io.on('connection', (socket) => {
//   console.log('🟢 User connected:', socket.id);

//   socket.on('join_room', (roomId) => {
//     socket.join(roomId);
//     console.log(`📥 User ${socket.id} joined room: ${roomId}`);
//   });

//   socket.on('send_message', (data) => {
//     io.to(data.roomId).emit('receive_message', data);
//   });

//   socket.on('disconnect', () => {
//     console.log('🔴 User disconnected:', socket.id);
//   });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// httpServer.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });


import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import publicDoctorRoutes from './routes/publicDoctorRoutes.js';
import ratingRoutes from './routes/rating.js';

dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', doctorRoutes);
app.use('/api/doctors', publicDoctorRoutes);
app.use('/api/ratings', ratingRoutes);
// Root route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
