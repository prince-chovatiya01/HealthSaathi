import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Appointment from '../models/Appointment.js'; // Adjust path as needed

// Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { phoneNumber, name, password, role } = req.body;

  const userExists = await User.findOne({ phoneNumber });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    phoneNumber,
    password, // ✅ just assign raw password
    role: role === 'admin' ? 'admin' : 'user',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});



// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;

  console.log('📲 Login attempt');
  console.log('Phone Number:', phoneNumber);
  console.log('Password:', password);

  const user = await User.findOne({ phoneNumber });

  if (!user) {
    console.log('❌ No user found with that phone number.');
    res.status(401);
    throw new Error('Invalid credentials');
  }

  console.log('✅ User found:', user.name);
  console.log('🔐 Hashed password in DB:', user.password);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log('🔍 Password match:', isMatch);

  if (isMatch) {
    console.log('🎉 Login successful');
    return res.json({
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    console.log('❌ Password incorrect');
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  console.log('getUserProfile called for user ID:', req.user.id); // Debug log
  
  const user = await User.findById(req.user.id);
  
  if (user) {
    console.log('User found:', user.name); // Debug log
    
    // Fetch appointments from the Appointment collection
    console.log('Searching for appointments with userId:', req.user.id); // Debug log
    const appointments = await Appointment.find({ userId: req.user.id });
    
    console.log('Found appointments:', appointments.length); // Debug log
    console.log('Appointments data:', appointments); // Debug log
    
    if (appointments.length > 0) {
      // Populate doctor details if appointments exist
      const populatedAppointments = await Appointment.find({ userId: req.user.id })
        .populate('doctorId', 'name specialization');
      
      console.log('Populated appointments:', populatedAppointments); // Debug log
      
      // Transform appointments to match frontend expected structure
      const transformedAppointments = populatedAppointments.map(apt => ({
        _id: apt._id,
        date: apt.date,
        time: apt.time,
        status: apt.status,
        notes: apt.notes,
        doctor: {
          name: apt.doctorId?.name || 'Unknown Doctor',
          specialization: apt.doctorId?.specialization || 'General'
        }
      }));
      
      res.json({
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        appointments: transformedAppointments,
        healthMetrics: user.healthMetrics || {},
      });
    } else {
      res.json({
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        appointments: [],
        healthMetrics: user.healthMetrics || {},
      });
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { registerUser, loginUser, getUserProfile };

