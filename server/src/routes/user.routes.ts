// Routes for user management
// Mostly auth-protected except for the public profile endpoint
import { Router } from 'express';
import { 
  getUserProfile,
  updateUsername,
  getUserById,
  ensureUserExists
} from '../controllers/user.controller';
import { checkJwt } from '../middleware/auth.middleware';

const router = Router();

// Protected routes - require authentication
// FUTURE KYLE - REMEMBER 
// PUT THESE BEFORE THE PARAM ROUTES IF YOU MAKE CHANGES HERE
router.get('/me', checkJwt, ensureUserExists, getUserProfile);
router.put('/me', checkJwt, ensureUserExists, updateUsername);

// Public routes with userId parameter
router.get('/:userId', getUserById);

export default router;