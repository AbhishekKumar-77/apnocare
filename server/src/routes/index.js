import express from 'express';
import healthRoutes from './healthRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import inquiryRoutes from './inquiryRoutes.js';
import authRoutes from './authRoutes.js';
import patientRoutes from './patientRoutes.js';
import requestRoutes from './requestRoutes.js';
import repRoutes from './repRoutes.js';
import adminRoutes from './adminRoutes.js';
import recordRoutes from './recordRoutes.js';
import notifRoutes from './notifRoutes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/services', serviceRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/requests', requestRoutes);
router.use('/representative', repRoutes);
router.use('/admin', adminRoutes);
router.use('/records', recordRoutes);
router.use('/notifications', notifRoutes);

export default router;
