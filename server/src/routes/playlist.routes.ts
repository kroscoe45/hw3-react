// Routes for playlist CRUD operations
// Public routes don't need auth, private routes use middleware checks
import express from 'express';
import { checkJwt, canAccessPlaylist } from '../middleware/auth.middleware';
import * as PlaylistController from '../controllers/playlist.controller';

const router = express.Router();

// Optional authentication middleware that continues even if auth fails
const optionalAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  checkJwt(req, res, (err) => {
    // Continue to next middleware regardless of authentication result
    next();
  });
};

// Public routes
router.get('/public', PlaylistController.getPublicPlaylists);

// Protected routes - user specific
router.get('/user', checkJwt, PlaylistController.getUserPlaylists);

// CRUD operations on playlists
router.post('/', checkJwt, PlaylistController.createPlaylist);

// Get playlist with resolved track details
router.get('/:id/tracks', optionalAuth, canAccessPlaylist, PlaylistController.getPlaylistWithTracks);

// These routes must include proper authentication
router.get('/:id', optionalAuth, canAccessPlaylist, PlaylistController.getPlaylistById);
router.put('/:id', checkJwt, canAccessPlaylist, PlaylistController.updatePlaylist);
router.delete('/:id', checkJwt, canAccessPlaylist, PlaylistController.deletePlaylist);

// Track operations on playlists - require authentication and access control
router.post('/:id/tracks', checkJwt, canAccessPlaylist, PlaylistController.addTrackToPlaylist);
router.delete('/:id/tracks/:trackId', checkJwt, canAccessPlaylist, PlaylistController.removeTrackFromPlaylist);
router.put('/:id/tracks/reorder', checkJwt, canAccessPlaylist, PlaylistController.reorderPlaylistTracks);

export default router;