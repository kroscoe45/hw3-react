// client/src/services/playlistService.ts
import { Playlist } from '../types/playlist';

const API_URL = '/api/playlists';

/**
 * Get all public playlists
 */
export const getPublicPlaylists = async (): Promise<Playlist[]> => {
  const response = await fetch(`${API_URL}/public`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch public playlists');
  }
  
  return response.json();
};

/**
 * Get playlists for the authenticated user
 */
export const getUserPlaylists = async (token: string): Promise<Playlist[]> => {
  const response = await fetch(`${API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user playlists');
  }
  
  return response.json();
};

/**
 * Get a playlist by ID
 */
export const getPlaylistById = async (id: string, token?: string): Promise<Playlist> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization header if token is provided
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}/${id}`, {
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch playlist');
  }
  
  return response.json();
};

/**
 * Get a playlist by ID with resolved track details
 */
export const getPlaylistWithTracks = async (id: string, token?: string): Promise<Playlist> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization header if token is provided
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}/${id}/tracks`, {
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch playlist with tracks');
  }
  
  return response.json();
};

/**
 * Create a new playlist
 */
export const createPlaylist = async (
  playlistData: { title: string; isPublic: boolean },
  token: string
): Promise<Playlist> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(playlistData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create playlist');
  }
  
  return response.json();
};

/**
 * Update an existing playlist
 */
export const updatePlaylist = async (
  id: string,
  playlistData: { title?: string; isPublic?: boolean },
  token: string
): Promise<Playlist> => {
  console.log(`Sending update request for playlist ${id} with token`);
  
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(playlistData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error(`Update playlist failed with status ${response.status}:`, errorData);
    throw new Error(errorData.error || `Failed to update playlist (${response.status})`);
  }
  
  return response.json();
};

/**
 * Delete a playlist
 */
export const deletePlaylist = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete playlist');
  }
};

/**
 * Add a track to a playlist
 */
export const addTrackToPlaylist = async (
  playlistId: string,
  trackId: string,
  token: string
): Promise<Playlist> => {
  const response = await fetch(`${API_URL}/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ trackId }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add track to playlist');
  }
  
  return response.json();
};

/**
 * Remove a track from a playlist
 */
export const removeTrackFromPlaylist = async (
  playlistId: string,
  trackId: string,
  token: string
): Promise<Playlist> => {
  const response = await fetch(`${API_URL}/${playlistId}/tracks/${trackId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove track from playlist');
  }
  
  return response.json();
};

/**
 * Reorder tracks in a playlist
 */
export const reorderPlaylistTracks = async (
  playlistId: string,
  trackIds: string[],
  token: string
): Promise<Playlist> => {
  const response = await fetch(`${API_URL}/${playlistId}/tracks/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tracklist: trackIds }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to reorder tracks');
  }
  
  return response.json();
};