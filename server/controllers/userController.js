import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Appointment from '../models/Appointment.js';

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

  // Security: only allow 'user' role via public registration
  const user = await User.create({
    name,
    phoneNumber,
    password,
    role: 'user', // Always 'user' — admin must be set manually in DB
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

  const user = await User.findOne({ phoneNumber });

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    return res.json({
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Fetch appointments with doctor info
  const appointments = await Appointment.find({ userId: req.user.id })
    .populate('doctorId', 'name specialization')
    .sort({ date: -1, time: 1 });

  const transformedAppointments = appointments.map(apt => ({
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
    healthMetrics: user.healthMetrics || null,
  });
});

// @desc    Update user profile (name)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.body.name) user.name = req.body.name;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    phoneNumber: updatedUser.phoneNumber,
    role: updatedUser.role,
  });
});

// @desc    Update health metrics
// @route   PUT /api/users/health-metrics
// @access  Private
const updateHealthMetrics = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { heartRate, bloodPressure, weight, temperature, steps } = req.body;

  user.healthMetrics = {
    ...(user.healthMetrics || {}),
    ...(heartRate !== undefined && { heartRate }),
    ...(bloodPressure !== undefined && { bloodPressure }),
    ...(weight !== undefined && { weight }),
    ...(temperature !== undefined && { temperature }),
    ...(steps !== undefined && { steps }),
    lastUpdated: new Date().toISOString()
  };

  await user.save();

  res.json({
    success: true,
    healthMetrics: user.healthMetrics
  });
});

export { registerUser, loginUser, getUserProfile, updateUserProfile, updateHealthMetrics };
