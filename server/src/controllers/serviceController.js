import Service from '../models/Service.js';
import { getDBStatus } from '../config/db.js';

const DEFAULT_SERVICES = [
  {
    title: 'Elderly Companion & Daily Living',
    category: 'Elderly Care',
    description: 'Empathetic, round-the-clock support for seniors including mobility, medication reminders, hygiene, and companionship.',
    icon: 'HeartHandshake',
    pricePerDay: 1200,
    isPopular: true,
    features: ['24/7 Dedicated Attendant', 'Medication Management', 'Mobility & Fall Prevention', 'Daily Activity Logging'],
  },
  {
    title: 'Skilled Clinical Home Nursing',
    category: 'Nursing Support',
    description: 'Certified registered nurses for IV infusions, catheter care, wound dressing, tracheostomy management, and vital monitoring.',
    icon: 'Stethoscope',
    pricePerDay: 2200,
    isPopular: true,
    features: ['Registered B.Sc Nurses', 'Vital Signs Tracking', 'Wound & Dressing Care', 'Doctor Consultation Liaison'],
  },
  {
    title: 'In-Home Physiotherapy',
    category: 'Physiotherapy',
    description: 'Custom rehabilitation sessions for stroke recovery, joint replacements, neurological conditions, and mobility restoration.',
    icon: 'Activity',
    pricePerDay: 900,
    isPopular: false,
    features: ['Certified Physiotherapist', 'Personalized Exercise Regime', 'Pain Reduction Modalities', 'Progress Metric Reports'],
  },
  {
    title: 'Post-Operative Recovery Care',
    category: 'Post-Op Recovery',
    description: 'Specialized transitional care after cardiac, orthopedic, or abdominal surgeries to prevent hospital readmissions.',
    icon: 'ShieldPlus',
    pricePerDay: 1800,
    isPopular: false,
    features: ['Surgical Wound Inspection', 'Infection Prevention Protocols', 'Nutritional Monitoring', 'Emergency Escalation Plan'],
  },
];

export const getServices = async (req, res, next) => {
  try {
    const db = getDBStatus();
    if (db.isConnected) {
      let count = await Service.countDocuments();
      if (count === 0) {
        await Service.insertMany(DEFAULT_SERVICES);
      }
      const services = await Service.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        source: 'MongoDB Atlas',
        count: services.length,
        data: services,
      });
    }

    // Fallback when MongoDB is still in setup mode
    res.status(200).json({
      success: true,
      source: 'Default Mock Data (MongoDB not connected)',
      count: DEFAULT_SERVICES.length,
      data: DEFAULT_SERVICES,
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const db = getDBStatus();
    if (!db.isConnected) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB Atlas is not connected yet. Please configure server/.env with your connection string.',
      });
    }

    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};
