// server/src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

/* 
 * User controller handles operations related to user management
 * Manages the integration between Auth0 users and the application's user data
 */

// Get the authenticated user's profile
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const auth0Id = req.auth?.payload.sub;
    
    // Find user in our database
    let user = await User.findOne({ auth0Id });
    
    // If user doesn't exist in our database, create a new one
    if (!user) {
      // Get username from Auth0 profile or generate one
      const username = req.auth?.payload.nickname || `user_${Date.now()}`;
      
      user = new User({
        auth0Id,
        userId: uuidv4(), // Generate a unique public ID
        username
      });
      
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update username
export const updateUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const auth0Id = req.auth?.payload.sub;
    const { username } = req.body;
    
    if (!username) {
      res.status(400).json({ error: 'Username is required' });
      return;
    }
    
    // Find and update user
    const user = await User.findOneAndUpdate(
      { auth0Id },
      { username },
      { new: true }
    );
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user by public userId
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const user = await User.findOne({ userId });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Return only public information
    res.json({
      userId: user.userId,
      username: user.username
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Middleware to ensure user exists in our database and attach to request
export const ensureUserExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const auth0Id = req.auth?.payload.sub;
    
    if (!auth0Id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    // Check if user exists in our database
    let user = await User.findOne({ auth0Id });
    
    // If user doesn't exist, create a new one with Auth0 profile data
    if (!user) {
      const username = req.auth?.payload.nickname || `user_${Date.now()}`;
      
      user = new User({
        auth0Id,
        userId: uuidv4(), // Generate a unique public ID
        username
      });
      
      await user.save();
    }
    
    // Add user to request for downstream middleware/controllers
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    res.status(500).json({ error: 'Server error' });
  }
};