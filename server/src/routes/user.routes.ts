// Routes for user management
// Mostly auth-protected except for the public profile endpoint
import { Router } from 'express';
import { 
  getUserProfile,
  updateUserProfile,
  getUserById,
} from '../controllers/user.controller';
import { checkJwt } from '../middleware/auth.middleware';

const router = Router();

// Protected routes - require authentication
// FUTURE KYLE - REMEMBER 
// PUT THESE BEFORE THE PARAM ROUTES IF YOU MAKE CHANGES HERE
router.get('/me', checkJwt, getUserProfile); // Removed ensureUserExists since getUserProfile now handles creation
router.put('/me', checkJwt, updateUserProfile);

// Public routes with userId parameter
router.get('/:userId', getUserById);

export default router;