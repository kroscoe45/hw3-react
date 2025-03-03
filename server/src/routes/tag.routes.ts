// server/src/routes/tag.routes.ts
import express from 'express';
import { checkJwt, canAccessPlaylist } from '../middleware/auth.middleware';
import * as TagController from '../controllers/tag.controller';

const router = express.Router();

// Get all tags for a playlist
router.get('/playlists/:playlistId/tags', TagController.getPlaylistTags);

// Protected routes that require authentication
router.post('/playlists/:playlistId/tags', checkJwt, TagController.addTagToPlaylist);
router.delete('/playlists/:playlistId/tags/:tagId', checkJwt, canAccessPlaylist, TagController.removeTagFromPlaylist);

// Voting on tags
router.post('/playlists/:playlistId/tags/:tagId/upvote', checkJwt, TagController.upvoteTag);
router.post('/playlists/:playlistId/tags/:tagId/downvote', checkJwt, TagController.downvoteTag);

export default router;