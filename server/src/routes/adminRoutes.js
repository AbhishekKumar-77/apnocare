import express from 'express';
import {
  getAdminAnalytics,
  getRepresentatives,
  updateRepresentativeVerification,
  getPartners,
  createPartner,
  getServiceAreas,
  addToWaitlist,
  getAuditLogs,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public waitlist endpoint
router.post('/waitlist', addToWaitlist);
router.get('/service-areas', getServiceAreas);

// Admin-only protected endpoints
router.get('/analytics', protect, authorize('ADMIN'), getAdminAnalytics);
router.get('/representatives', protect, authorize('ADMIN'), getRepresentatives);
router.put('/representatives/:id/verify', protect, authorize('ADMIN'), updateRepresentativeVerification);
router.get('/partners', getPartners); // public directory or admin view
router.post('/partners', protect, authorize('ADMIN'), createPartner);
router.get('/audit-logs', protect, authorize('ADMIN'), getAuditLogs);

export default router;
