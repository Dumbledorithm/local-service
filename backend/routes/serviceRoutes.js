import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createService, getMyServices } from '../controllers/serviceController.js';

const router = express.Router();

const providerMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'provider') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Providers only.' });
  }
};

router.post('/', authMiddleware, providerMiddleware, createService);
router.get('/my-services', authMiddleware, providerMiddleware, getMyServices);

export default router;