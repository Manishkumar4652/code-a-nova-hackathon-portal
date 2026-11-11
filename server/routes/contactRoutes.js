import { Router } from 'express';
import { submitContact, getContactInfo } from '../controllers/contactController.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/info', getContactInfo);
router.post('/', authLimiter, submitContact);

export default router;
