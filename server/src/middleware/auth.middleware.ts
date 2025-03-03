// server/src/middleware/auth.middleware.ts
// Auth middleware - checks if users are allowed to do stuff
// Handles JWT validation and playlist access permissions
import { Request, Response, NextFunction } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import Playlist from '../models/playlist.model';
import User from '../models/user.model';
import { auth0Config } from '../config/auth0.config';

// Validate Auth0 JWT tokens
export const checkJwt = auth({
  audience: auth0Config.audience,
  issuerBaseURL: `https://${auth0Config.domain}/`,
});

// Middleware to check if user can access a playlist
export const canAccessPlaylist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const playlistId = req.params.id;
    
    // Skip if no playlist ID (e.g., for routes like /playlists/user)
    if (!playlistId) {
      console.log('No playlist ID provided, skipping access check');
      next();
      return;
    }
    
    console.log(`Checking access for playlist: ${playlistId}`);
    
    // Find the playlist
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      console.log(`Playlist not found: ${playlistId}`);
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }
    
    // Public playlists are accessible to everyone
    if (playlist.isPublic) {
      console.log(`Playlist ${playlistId} is public, granting access`);
      next();
      return;
    }
    
    // Private playlists require authentication
    const auth0Id = req.auth?.payload.sub;
    console.log(`Playlist ${playlistId} is private, checking auth`);
    
    if (!auth0Id) {
      console.log('No auth token provided for private playlist');
      res.status(401).json({ error: 'Authentication required to access this playlist' });
      return;
    }
    
    // Get user's public userId
    const user = await User.findOne({ auth0Id });
    if (!user) {
      console.log(`User with Auth0 ID ${auth0Id} not found`);
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    console.log(`User ID: ${user.userId}, Playlist Owner: ${playlist.owner}`);
    
    // Check if the authenticated user is the owner
    if (user.userId === playlist.owner) {
      console.log(`User ${user.userId} is the owner of playlist ${playlistId}, granting access`);
      next();
      return;
    }
    
    // User is not the owner
    console.log(`User ${user.userId} is not the owner of playlist ${playlistId}, denying access`);
    res.status(403).json({ error: 'You do not have permission to access this playlist' });
  } catch (error) {
    console.error('Error in canAccessPlaylist middleware:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Middleware to check specific permissions
export const checkPermissions = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const permissions = req.auth?.payload.permissions as string[] || [];
    
    const hasAllRequiredPermissions = requiredPermissions.every(permission => 
      permissions.includes(permission)
    );
    
    if (hasAllRequiredPermissions) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};