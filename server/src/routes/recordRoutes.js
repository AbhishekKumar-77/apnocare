import express from 'express';
import { getRecords, uploadRecord, getFamilyShares, inviteFamilyMember } from '../controllers/recordController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getRecords)
  .post(protect, uploadRecord);

router.route('/shares')
  .get(protect, getFamilyShares)
  .post(protect, inviteFamilyMember);

export default router;
