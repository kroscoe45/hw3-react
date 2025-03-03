// Routes for track operations
// Anyone can view tracks, but only logged-in users can create/modify
import express from 'express';
import { checkJwt } from '../middleware/auth.middleware';
import * as TrackController from '../controllers/track.controller';

const router = express.Router();

// Public routes - anyone can get track information
router.get('/:id', TrackController.getTrackById);

// Protected routes - only authenticated users can perform these actions
router.post('/bulk', checkJwt, TrackController.getTracksByIds);
router.post('/', checkJwt, TrackController.createTrack);
router.put('/:id', checkJwt, TrackController.updateTrack);
router.delete('/:id', checkJwt, TrackController.deleteTrack);

export default router;