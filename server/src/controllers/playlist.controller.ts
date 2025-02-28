// server/src/controllers/playlist.controller.ts
import { Request, Response } from 'express';
import Playlist from '../models/playlist.model';
import User from '../models/user.model';

/* 
 * Playlist controller handles all CRUD operations for playlists
 * Implements access control based on playlist privacy settings
 */

// Get all public playlists
export const getPublicPlaylists = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(playlists);
  } catch (error) {
    console.error('Error getting public playlists:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get the authenticated user's playlists
export const getUserPlaylists = async (req: Request, res: Response): Promise<void> => {
  try {
    const auth0Id = req.auth?.payload.sub;
    
    // Get user's public userId
    const user = await User.findOne({ auth0Id });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    const playlists = await Playlist.find({ owner: user.userId })
      .sort({ updatedAt: -1 });
    
    res.json(playlists);
  } catch (error) {
    console.error('Error getting user playlists:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a specific playlist by ID (with access control)
export const getPlaylistById = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = req.params.id;
    const auth0Id = req.auth?.payload.sub;
    
    // Get user's public userId if authenticated
    let userId = null;
    if (auth0Id) {
      const user = await User.findOne({ auth0Id });
      if (user) {
        userId = user.userId;
      }
    }
    
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }
    
    // Check if user has access to this playlist
    if (!playlist.isPublic && (!userId || playlist.owner !== userId)) {
      res.status(403).json({ 
        error: 'Forbidden',
        message: 'You do not have permission to access this playlist' 
      });
      return;
    }
    
    res.json(playlist);
  } catch (error) {
    console.error('Error getting playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new playlist
export const createPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const auth0Id = req.auth?.payload.sub;
    const { title, isPublic } = req.body;
    
    // Get user's public userId
    const user = await User.findOne({ auth0Id });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Validate required fields
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }
    
    // Create a new playlist
    const newPlaylist = new Playlist({
      title,
      isPublic: isPublic || false,
      owner: user.userId,
      tracklist: [],
    });
    
    await newPlaylist.save();
    
    res.status(201).json(newPlaylist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a playlist (with owner access control)
export const updatePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = req.params.id;
    const auth0Id = req.auth?.payload.sub;
    const { title, isPublic } = req.body;
    
    // Get user's public userId
    const user = await User.findOne({ auth0Id });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }
    
    // Check if user owns this playlist
    if (playlist.owner !== user.userId) {
      res.status(403).json({ 
        error: 'Forbidden',
        message: 'You do not have permission to update this playlist' 
      });
      return;
    }
    
    // Update the playlist
    if (title) playlist.title = title;
    if (isPublic !== undefined) playlist.isPublic = isPublic;
    
    await playlist.save();
    
    res.json(playlist);
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a playlist (with owner access control)
export const deletePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = req.params.id;
    const auth0Id = req.auth?.payload.sub;
    
    // Get user's public userId
    const user = await User.findOne({ auth0Id });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }
    
    // Check if user owns this playlist
    if (playlist.owner !== user.userId) {
      res.status(403).json({ 
        error: 'Forbidden',
        message: 'You do not have permission to delete this playlist' 
      });
      return;
    }
    
    await Playlist.findByIdAndDelete(playlistId);
    
    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a track to a playlist
export const addTrackToPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = req.params.id;
    const auth0Id = req.auth?.payload.sub;
    const { trackId } = req.body;
    
    // Get user's public userId
    const user = await User.findOne({ auth0Id });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Validate required fields
    if (!trackId) {
      res.status(400).json({ error: 'Track ID is required' });
      return;
    }
    
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }
    
    // Check if user owns this playlist
    if (playlist.owner !== user.userId) {
      res.status(403).json({ 
        error: 'Forbidden',
        message: 'You do not have permission to modify this playlist' 
      });
      return;
    }
    
    // Check if track already exists in the playlist
    if (playlist.tracklist.includes(trackId)) {
      res.status(400).json({ error: 'Track already exists in playlist' });
      return;
    }
    
    // Add the track to the playlist
    playlist.tracklist.push(trackId);
    
    await playlist.save();
    
    res.json(playlist);
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove a track from a playlist
export const removeTrackFromPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = req.params.id;
    const trackId = req.params.trackId;
    const auth0Id = req.auth?.payload.sub;
    
    // Get user's public userId
    const user = await User.findOne({ auth0Id });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }
    
    // Check if user owns this playlist
    if (playlist.owner !== user.userId) {
      res.status(403).json({ 
        error: 'Forbidden',
        message: 'You do not have permission to modify this playlist' 
      });
      return;
    }
    
    // Remove the track from the playlist
    playlist.tracklist = playlist.tracklist.filter(id => id !== trackId);
    
    await playlist.save();
    
    res.json(playlist);
  } catch (error) {
    console.error('Error removing track from playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};