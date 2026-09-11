import express from 'express';
import { getAssignedTasks, updateTaskStatus } from '../controllers/representativeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/tasks', protect, authorize('REPRESENTATIVE', 'ADMIN'), getAssignedTasks);
router.post('/tasks/:id/step', protect, authorize('REPRESENTATIVE', 'ADMIN'), updateTaskStatus);

export default router;
