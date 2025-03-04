// server/src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

/* 
 * User controller handles operations related to user management
 * Manages the integration between Auth0 users and the application's user data
 */

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // Ideally, this should be a more specific type
    }
  }
}

// Get the authenticated user's profile
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const auth0Id = req.auth?.payload.sub;
    
    if (!auth0Id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Find user in our database
    let user = await User.findOne({ auth0Id });
    
    // If user doesn't exist in our database, create a new one
    if (!user) {
      console.log(`Creating new user for Auth0 ID: ${auth0Id}`);
      // Get user info from Auth0 profile
      const username = req.auth?.payload.nickname || `user_${Date.now()}`;
      const email = req.auth?.payload.email || '';
      
      user = new User({
        auth0Id,
        userId: uuidv4(), // Generate a unique public ID
        username,
        email,
        displayName: '' // Initially empty, user will set this
      });
      
      await user.save();
      console.log(`User created with ID: ${user.userId}`);
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user profile details
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const auth0Id = req.auth?.payload.sub;
    const { username, displayName } = req.body;
    
    // Validate required fields
    if (displayName !== undefined && displayName.trim() === '') {
      res.status(400).json({ error: 'Display name cannot be empty' });
      return;
    }
    
    // Check if displayName is already taken
    if (displayName) {
      const existingUser = await User.findOne({ 
        displayName: displayName.trim(),
        auth0Id: { $ne: auth0Id } // Exclude current user from check
      });
      
      if (existingUser) {
        res.status(400).json({ error: 'Display name is already taken' });
        return;
      }
    }
    
    // Prepare update object
    const updateData: any = {};
    if (username) updateData.username = username;
    if (displayName !== undefined) updateData.displayName = displayName.trim();
    
    // Find and update user
    const user = await User.findOneAndUpdate(
      { auth0Id },
      updateData,
      { new: true }
    );
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error : any) {
    console.error('Error updating user profile:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Display name is already taken' });
      return;
    }
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
      username: user.username,
      displayName: user.displayName
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
      const email = req.auth?.payload.email || '';
      
      user = new User({
        auth0Id,
        userId: uuidv4(), // Generate a unique public ID
        username,
        email,
        displayName: ''
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