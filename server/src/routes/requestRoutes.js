import express from 'express';
import {
  getRequests,
  getRequestById,
  createRequest,
  updateMilestone,
  assignRepresentative,
} from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getRequests)
  .post(protect, createRequest);

router.route('/:id')
  .get(protect, getRequestById);

router.route('/:id/milestone')
  .post(protect, updateMilestone);

router.route('/:id/assign')
  .post(protect, authorize('ADMIN'), assignRepresentative);

export default router;
