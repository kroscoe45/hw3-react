// All the track-related logic - pretty basic CRUD operations
// Most of the actual logic is in playlist.controller.ts
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Track from '../models/track.model';

// Get a track by ID
export const getTrackById = async (req: Request, res: Response): Promise<void> => {
  try {
    const trackId = req.params.id;
    
    const track = await Track.findOne({ trackId });
    
    if (!track) {
      res.status(404).json({ error: 'Track not found' });
      return;
    }
    
    res.json(track);
  } catch (error) {
    console.error('Error getting track:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get multiple tracks by IDs (bulk fetch)
export const getTracksByIds = async (req: Request, res: Response): Promise<void> => {
  try {
    const { trackIds } = req.body;
    
    if (!trackIds || !Array.isArray(trackIds)) {
      res.status(400).json({ error: 'Track IDs array is required' });
      return;
    }
    
    const tracks = await Track.find({ trackId: { $in: trackIds } });
    
    res.json(tracks);
  } catch (error) {
    console.error('Error getting tracks:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new track
export const createTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, artist } = req.body;
    
    // Validate required fields
    if (!title || !artist) {
      res.status(400).json({ error: 'Title and artist are required' });
      return;
    }
    
    // Generate a unique trackId
    const trackId = uuidv4();
    
    // Create a new track
    const newTrack = new Track({
      trackId,
      title,
      artist,
    });
    
    await newTrack.save();
    
    res.status(201).json(newTrack);
  } catch (error) {
    console.error('Error creating track:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a track
export const updateTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const trackId = req.params.id;
    const { title, artist } = req.body;
    
    const track = await Track.findOne({ trackId });
    
    if (!track) {
      res.status(404).json({ error: 'Track not found' });
      return;
    }
    
    // Update the track
    if (title) track.title = title;
    if (artist) track.artist = artist;
    
    await track.save();
    
    res.json(track);
  } catch (error) {
    console.error('Error updating track:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a track
export const deleteTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const trackId = req.params.id;
    
    const track = await Track.findOne({ trackId });
    
    if (!track) {
      res.status(404).json({ error: 'Track not found' });
      return;
    }
    
    await Track.deleteOne({ trackId });
    
    res.status(200).json({ message: 'Track deleted successfully' });
  } catch (error) {
    console.error('Error deleting track:', error);
    res.status(500).json({ error: 'Server error' });
  }
};