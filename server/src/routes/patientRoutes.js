import express from 'express';
import { getPatients, getPatientById, createPatient, updatePatient } from '../controllers/patientController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getPatients)
  .post(protect, authorize('CUSTOMER', 'ADMIN'), createPatient);

router.route('/:id')
  .get(protect, getPatientById)
  .put(protect, authorize('CUSTOMER', 'ADMIN'), updatePatient);

export default router;
