import { Router } from 'express';
import { registerHackathon, getMyEntry } from '../controllers/hackathonController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Protected Hackathon Registration Endpoints
router.post('/register', protect, registerHackathon);
router.get('/my-entry', protect, getMyEntry);

export default router;

