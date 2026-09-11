import Inquiry from '../models/Inquiry.js';
import { getDBStatus } from '../config/db.js';

// In-memory fallback array when MongoDB Atlas is pending connection
const inMemoryInquiries = [];

export const getInquiries = async (req, res, next) => {
  try {
    const db = getDBStatus();
    if (db.isConnected) {
      const inquiries = await Inquiry.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        source: 'MongoDB Atlas',
        count: inquiries.length,
        data: inquiries,
      });
    }

    res.status(200).json({
      success: true,
      source: 'In-Memory Fallback',
      count: inMemoryInquiries.length,
      data: inMemoryInquiries,
    });
  } catch (error) {
    next(error);
  }
};

export const createInquiry = async (req, res, next) => {
  try {
    const { fullName, phone, email, careType, patientAge, city, notes } = req.body;

    if (!fullName || !phone || !city) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone number, and city are required.',
      });
    }

    const db = getDBStatus();
    if (db.isConnected) {
      const inquiry = await Inquiry.create({
        fullName,
        phone,
        email,
        careType: careType || 'Elderly Care',
        patientAge: patientAge ? Number(patientAge) : undefined,
        city,
        notes,
      });

      return res.status(201).json({
        success: true,
        source: 'MongoDB Atlas',
        message: 'Care request saved successfully in MongoDB Atlas!',
        data: inquiry,
      });
    }

    // Save in memory fallback if DB not connected yet
    const fallbackInquiry = {
      _id: `temp_${Date.now()}`,
      fullName,
      phone,
      email,
      careType: careType || 'Elderly Care',
      patientAge: patientAge ? Number(patientAge) : undefined,
      city,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    inMemoryInquiries.unshift(fallbackInquiry);

    res.status(201).json({
      success: true,
      source: 'In-Memory Demo (Configure MongoDB Atlas to persist in database)',
      message: 'Care request received (In-Memory mode). Connect MongoDB Atlas to store permanently!',
      data: fallbackInquiry,
    });
  } catch (error) {
    next(error);
  }
};
