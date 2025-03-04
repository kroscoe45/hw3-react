// Defines the user-related types in our app
// Separating public vs private info so we don't
// accidentally leak anything sensitive

// Complete profile for authenticated users
export interface User {
  auth0Id: string;
  userId: string;
  username: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

// Public user profile (visible to other users)
export interface PublicUserProfile {
  userId: string;
  username: string;
  displayName: string;
}