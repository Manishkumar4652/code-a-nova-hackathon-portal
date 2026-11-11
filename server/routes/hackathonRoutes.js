import { Router } from 'express';
import {
  registerHackathon,
  getMyEntry,
  deleteEntry,
} from '../controllers/hackathonController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Protected Hackathon Registration Endpoints
router.post('/register', protect, registerHackathon);
router.get('/my-entry', protect, getMyEntry);
router.delete('/:id', protect, deleteEntry);

export default router;
