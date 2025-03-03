// server/src/models/index.ts
/*
 * This barrel file exports all models for easy import throughout the application.
 * It allows importing multiple models from a single import statement.
 */

export { default as Track } from './track.model';
export { default as Playlist } from './playlist.model';
export { default as Tag } from './tag.model';
export { default as User } from './user.model';
