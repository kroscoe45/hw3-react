// server/src/middleware/auth.middleware.ts
import { auth } from 'express-oauth2-jwt-bearer';
import { Request, Response, NextFunction } from 'express';
import { auth0Config } from '../config/auth0.config';
import Playlist from '../models/playlist.model';
import User from '../models/user.model';

/* 
 * Middleware for validating JWT tokens from Auth0
 * Checks if the request has a valid JWT token before allowing access to protected routes
 */
export const checkJwt = auth({
  audience: auth0Config.audience,
  issuerBaseURL: `https://${auth0Config.domain}/`,
});

/* 
 * Middleware for checking specific permissions in the JWT token
 * Used to restrict access to routes based on user permissions
 */
export const checkPermissions = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Explicitly type the permissions as a string array
    const permissions: string[] = req.auth?.payload.permissions as string[] || [];
    
    const hasAllRequiredPermissions = requiredPermissions.every(
      (permission: string): boolean => permissions.includes(permission)
    );

    if (!hasAllRequiredPermissions) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

/* 
 * Middleware to check if a user can access a playlist
 * Allows access if the playlist is public or if the user is the owner
 */
export const canAccessPlaylist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const playlistId = req.params.id;
    const auth0Id = req.auth?.payload.sub;
    
    if (!auth0Id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    // First, get the user's userId from auth0Id
    const user = await User.findOne({ auth0Id });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    const userId = user.userId;
    
    // Now, check playlist access using userId
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }

    if (playlist.isPublic || playlist.owner === userId) {
      next();
      return;
    }

    res.status(403).json({ 
      error: 'Forbidden',
      message: 'You do not have permission to access this playlist'
    });
  } catch (error) {
    console.error('Error in canAccessPlaylist middleware:', error);
    res.status(500).json({ error: 'Server error' });
  }
};