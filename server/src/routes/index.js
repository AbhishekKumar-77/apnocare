import express from 'express';
import healthRoutes from './healthRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import inquiryRoutes from './inquiryRoutes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/services', serviceRoutes);
router.use('/inquiries', inquiryRoutes);

export default router;
