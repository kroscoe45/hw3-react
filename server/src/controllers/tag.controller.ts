// server/src/controllers/tag.controller.ts
import { Request, Response } from 'express';
import Playlist from '../models/playlist.model';
import Tag from '../models/tag.model';
import User from '../models/user.model';

// Get all tags for a playlist
export const getPlaylistTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const { playlistId } = req.params;
    
    // Fetch tags associated with this playlist
    const tags = await Tag.find({ playlists: playlistId });
    
    res.status(200).json(tags);
  } catch (error) {
    console.error('Error getting playlist tags:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a tag to a playlist
export const addTagToPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { playlistId } = req.params;
    const { name } = req.body;
    const auth0Id = req.auth?.payload.sub;
    
    if (!name || typeof name !== 'string') {
      res.status(400).json({ error: 'Tag name is required' });
      return;
    }
    
    // Normalize tag name (lowercase, trim whitespace)
    const normalizedName = name.toLowerCase().trim();
    
    if (normalizedName.length < 2 || normalizedName.length > 20) {
      res.status(400).json({ error: 'Tag name must be between 2 and 20 characters' });
      return;
    }
    
    // Check if playlist exists
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }
    
    // Get user info
    const user = await User.findOne({ auth0Id });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Check if this tag already exists (case-insensitive)
    let tag = await Tag.findOne({ name: new RegExp(`^${normalizedName}$`, 'i') });
    
    if (!tag) {
      // Create a new tag if it doesn't exist
      tag = new Tag({
        name: normalizedName,
        playlists: [playlistId],
        upvotes: [user.userId], // Auto-upvote by creator
        downvotes: []
      });
    } else {
      // If tag exists, add this playlist to its list if not already there
      if (!tag.playlists.includes(playlistId)) {
        tag.playlists.push(playlistId);
      }
      
      // Auto-upvote by creator if they haven't voted yet
      if (!tag.upvotes.includes(user.userId) && !tag.downvotes.includes(user.userId)) {
        tag.upvotes.push(user.userId);
      }
    }
    
    await tag.save();
    
    res.status(201).json(tag);
  } catch (error) {
    console.error('Error adding tag to playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove a tag from a playlist
export const removeTagFromPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { playlistId, tagId } = req.params;
    
    // Check if tag exists
    const tag = await Tag.findById(tagId);
    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }
    
    // Check if this tag is associated with the playlist
    if (!tag.playlists.includes(playlistId)) {
      res.status(400).json({ error: 'Tag is not associated with this playlist' });
      return;
    }
    
    // Remove this playlist from the tag's list
    tag.playlists = tag.playlists.filter(id => id !== playlistId);
    
    // If this was the last playlist using this tag, delete the tag entirely
    if (tag.playlists.length === 0) {
      await Tag.findByIdAndDelete(tagId);
      res.status(200).json({ message: 'Tag removed successfully' });
    } else {
      // Otherwise, just update the tag
      await tag.save();
      res.status(200).json(tag);
    }
  } catch (error) {
    console.error('Error removing tag from playlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Upvote a tag
export const upvoteTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tagId } = req.params;
    const auth0Id = req.auth?.payload.sub;
    
    // Get user info
    const user = await User.findOne({ auth0Id });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Check if tag exists
    const tag = await Tag.findById(tagId);
    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }
    
    // Check if user has already upvoted this tag
    const alreadyUpvoted = tag.upvotes.includes(user.userId);
    const alreadyDownvoted = tag.downvotes.includes(user.userId);
    
    if (alreadyUpvoted) {
      // If already upvoted, remove the upvote (toggle off)
      tag.upvotes = tag.upvotes.filter(id => id !== user.userId);
    } else {
      // Add upvote and remove any existing downvote
      tag.upvotes.push(user.userId);
      
      if (alreadyDownvoted) {
        tag.downvotes = tag.downvotes.filter(id => id !== user.userId);
      }
    }
    
    await tag.save();
    
    res.status(200).json(tag);
  } catch (error) {
    console.error('Error upvoting tag:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Downvote a tag
export const downvoteTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tagId } = req.params;
    const auth0Id = req.auth?.payload.sub;
    
    // Get user info
    const user = await User.findOne({ auth0Id });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Check if tag exists
    const tag = await Tag.findById(tagId);
    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }
    
    // Check if user has already downvoted this tag
    const alreadyDownvoted = tag.downvotes.includes(user.userId);
    const alreadyUpvoted = tag.upvotes.includes(user.userId);
    
    if (alreadyDownvoted) {
      // If already downvoted, remove the downvote (toggle off)
      tag.downvotes = tag.downvotes.filter(id => id !== user.userId);
    } else {
      // Add downvote and remove any existing upvote
      tag.downvotes.push(user.userId);
      
      if (alreadyUpvoted) {
        tag.upvotes = tag.upvotes.filter(id => id !== user.userId);
      }
    }
    
    await tag.save();
    
    res.status(200).json(tag);
  } catch (error) {
    console.error('Error downvoting tag:', error);
    res.status(500).json({ error: 'Server error' });
  }
};