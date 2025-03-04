// src/routes/dev.routes.ts
import express from 'express';
import Playlist from '../models/playlist.model';

const router = express.Router();

// WARNING: This route should ONLY be used in development environments
// Add this check to ensure it's not accidentally enabled in production
router.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }
  next();
});

// Route to delete all playlists
router.delete('/cleanup/playlists', async (req, res) => {
  try {
    const result = await Playlist.deleteMany({});
    res.json({ 
      message: 'All playlists deleted successfully', 
      count: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting playlists:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;