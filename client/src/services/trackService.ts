// client/src/services/track.service.ts
import { Track } from '../types/track';

const API_URL = '/api/tracks';

/**
 * Get a track by its ID
 */
export const getTrackById = async (trackId: string, token?: string): Promise<Track> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token is provided
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/${trackId}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch track');
  }

  return response.json();
};

/**
 * Get multiple tracks by their IDs
 */
export const getTracksByIds = async (trackIds: string[], token?: string): Promise<Track[]> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token is provided
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/bulk`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ trackIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch tracks');
  }

  return response.json();
};

/**
 * Create a new track
 */
export const createTrack = async (trackData: { title: string; artist: string }, token: string): Promise<Track> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(trackData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create track');
  }

  return response.json();
};

/**
 * Update an existing track
 */
export const updateTrack = async (
  trackId: string,
  trackData: { title?: string; artist?: string },
  token: string
): Promise<Track> => {
  const response = await fetch(`${API_URL}/${trackId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(trackData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update track');
  }

  return response.json();
};

/**
 * Delete a track
 */
export const deleteTrack = async (trackId: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${trackId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete track');
  }
};