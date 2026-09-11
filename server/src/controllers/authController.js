import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { store } from '../config/store.js';

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'apnocare_super_secret_jwt_key_2026_remote_family_care',
    { expiresIn: '30d' }
  );
};

export const register = (req, res) => {
  const { name, email, password, phone, country, role = 'CUSTOMER' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
  }

  const existing = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUser = {
    _id: `usr_${Date.now()}`,
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    country: country || 'India',
    role,
    passwordHash,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString(),
  };

  store.users.push(newUser);

  // If registering as representative, initialize representative profile
  if (role === 'REPRESENTATIVE') {
    store.representatives.push({
      _id: `rep_${Date.now()}`,
      userId: newUser._id,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      city: 'Pending Assignment',
      state: 'India',
      badgeId: `AC-PENDING-${Math.floor(100 + Math.random() * 900)}`,
      verificationStatus: 'PENDING',
      policeVerificationStatus: 'PENDING',
      trainingCompleted: false,
      experienceYears: 0,
      rating: 5.0,
      totalAssists: 0,
      activeAssists: 0,
      skills: ['Elderly Care Assistance'],
      languages: ['English', 'Hindi'],
    });
  }

  const token = generateToken(newUser._id, newUser.role);
  res.status(201).json({
    success: true,
    token,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      country: newUser.country,
      role: newUser.role,
      avatar: newUser.avatar,
    },
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password.' });
  }

  const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. Please check email/password.' });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. Please check email/password.' });
  }

  const token = generateToken(user._id, user.role);
  res.status(200).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

export const getMe = (req, res) => {
  const user = req.user;
  let extra = {};

  if (user.role === 'CUSTOMER') {
    extra.patients = store.patients.filter((p) => p.customerId === user._id);
    extra.activeRequestsCount = store.serviceRequests.filter(
      (r) => r.customerId === user._id && !['COMPLETED', 'CANCELLED'].includes(r.status)
    ).length;
  } else if (user.role === 'REPRESENTATIVE') {
    extra.repProfile = store.representatives.find((r) => r.userId === user._id || r._id === 'rep_1');
    extra.activeTasks = store.serviceRequests.filter(
      (r) => r.representativeId === extra.repProfile?._id && !['COMPLETED', 'CANCELLED'].includes(r.status)
    );
  } else if (user.role === 'PATIENT') {
    extra.patientProfile = store.patients.find((p) => p.phone === user.phone || p._id === 'pat_1');
  }

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      role: user.role,
      avatar: user.avatar,
    },
    ...extra,
  });
};

export const getDemoAccounts = (req, res) => {
  const personas = store.users.map((u) => {
    let subtitle = '';
    if (u.role === 'CUSTOMER') subtitle = 'Arjun Mehta (NRI Son in Toronto, Canada)';
    else if (u.role === 'PATIENT') subtitle = 'Sunita Mehta (Elderly Mother in Jalandhar, Punjab)';
    else if (u.role === 'REPRESENTATIVE') subtitle = 'Rahul Sharma (Verified Care Rep in Jalandhar)';
    else if (u.role === 'ADMIN') subtitle = 'Platform Control & Operations Manager';

    return {
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      country: u.country,
      avatar: u.avatar,
      subtitle,
      token: generateToken(u._id, u.role),
    };
  });

  res.status(200).json({
    success: true,
    personas,
  });
};
