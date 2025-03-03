import { Tag } from '../types/tag';

const API_URL = '/api';

/**
 * Get all tags for a playlist
 */
export const getPlaylistTags = async (playlistId: string, token?: string): Promise<Tag[]> => {
  const headers: HeadersInit = {};
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}/playlists/${playlistId}/tags`, {
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch tags');
  }
  
  return response.json();
};

/**
 * Add a tag to a playlist
 */
export const addTagToPlaylist = async (
  playlistId: string, 
  tagName: string, 
  token: string
): Promise<Tag> => {
  const response = await fetch(`${API_URL}/playlists/${playlistId}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: tagName }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add tag');
  }
  
  return response.json();
};

/**
 * Remove a tag from a playlist
 */
export const removeTagFromPlaylist = async (
  playlistId: string,
  tagId: string,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/playlists/${playlistId}/tags/${tagId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove tag');
  }
};

/**
 * Upvote a tag
 */
export const upvoteTag = async (
  playlistId: string,
  tagId: string,
  token: string
): Promise<Tag> => {
  const response = await fetch(`${API_URL}/playlists/${playlistId}/tags/${tagId}/upvote`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upvote tag');
  }
  
  return response.json();
};

/**
 * Downvote a tag
 */
export const downvoteTag = async (
  playlistId: string,
  tagId: string,
  token: string
): Promise<Tag> => {
  const response = await fetch(`${API_URL}/playlists/${playlistId}/tags/${tagId}/downvote`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to downvote tag');
  }
  
  return response.json();
};