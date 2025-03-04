// Where all the playlist logic lives 
// Handles CRUD operations with access control
import { Request, Response } from 'express';
import Playlist from '../models/playlist.model';
import User from '../models/user.model';
import Track from '../models/track.model';

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

// Get a specific playlist by ID (access control handled by middleware)
export const getPlaylistById = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = req.params.id;
    
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }
    
    // Access control now handled by middleware
    res.json(playlist);
  } catch (error) {
    console.error('Error getting playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get playlist with resolved track details
export const getPlaylistWithTracks = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = req.params.id;
    
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }
    // Fetch track details for all trackIds in the playlist
    const tracks = await Track.find({ trackId: { $in: playlist.tracklist } });
    
    // Create a map for quick track lookup
    const trackMap = tracks.reduce((map, track) => {
      map[track.trackId] = track;
      return map;
    }, {} as Record<string, any>);
    
    // Maintain the order of tracks as stored in the playlist
    const orderedTracks = playlist.tracklist.map(trackId => trackMap[trackId] || null).filter(Boolean);
    
    const playlistWithTracks = {
      ...playlist.toObject(),
      tracks: orderedTracks
    };
    
    res.json(playlistWithTracks);
  } catch (error) {
    console.error('Error getting playlist with tracks:', error);
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

// Update a playlist (access control handled by middleware)
export const updatePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = req.params.id;
    const { title, isPublic } = req.body;
    
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }
    
    // Access control now handled by middleware
    
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

// Delete a playlist (access control handled by middleware)
export const deletePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = req.params.id;
    
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }
    
    // Access control now handled by middleware
    
    await Playlist.findByIdAndDelete(playlistId);
    
    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a track to a playlist (access control handled by middleware)
export const addTrackToPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = req.params.id;
    const { trackId } = req.body;
    
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
    
    // Access control now handled by middleware
    
    // Check if track exists in the database
    const trackExists = await Track.findOne({ trackId });
    if (!trackExists) {
      res.status(404).json({ error: 'Track not found' });
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

// Remove a track from a playlist (access control handled by middleware)
export const removeTrackFromPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = req.params.id;
    const trackId = req.params.trackId;
    
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }
    
    // Access control now handled by middleware
    
    // Remove the track from the playlist
    playlist.tracklist = playlist.tracklist.filter(id => id !== trackId);
    
    await playlist.save();
    
    res.json(playlist);
  } catch (error) {
    console.error('Error removing track from playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Reorder tracks in a playlist (access control handled by middleware)
export const reorderPlaylistTracks = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = req.params.id;
    const { tracklist } = req.body;
    
    // Validate required fields
    if (!tracklist || !Array.isArray(tracklist)) {
      res.status(400).json({ error: 'Track list array is required' });
      return;
    }
    
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }
    
    // Access control handled by middleware
    
    // Verify all tracks in the new order exist in the original playlist
    const trackSet = new Set(playlist.tracklist);
    const allTracksExist = tracklist.every(trackId => trackSet.has(trackId));
    const sameLength = tracklist.length === playlist.tracklist.length;
    
    if (!allTracksExist || !sameLength) {
      res.status(400).json({ error: 'New track list must contain the same tracks as the original playlist' });
      return;
    }
    
    // Update the track order
    playlist.tracklist = tracklist;
    
    await playlist.save();
    
    res.json(playlist);
  } catch (error) {
    console.error('Error reordering tracks in playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};