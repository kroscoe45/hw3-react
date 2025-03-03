// types/index.ts
/*
 * This is a barrel file that exports all type definitions from the types directory.
 * It allows importing multiple types from a single import statement, making it easier
 * to use types throughout the application without having to import from multiple files.
 * 
 * Related files:
 * - Re-exports types from playlist.ts, track.ts, and user.ts
 * - Used by components and services that need multiple types
 */

export * from './playlist';
export * from './track';
export * from './user';