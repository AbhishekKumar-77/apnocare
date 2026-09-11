import express from 'express';
import { getInquiries, createInquiry } from '../controllers/inquiryController.js';

const router = express.Router();

router.route('/')
  .get(getInquiries)
  .post(createInquiry);

export default router;
