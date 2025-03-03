// Mongoose model for playlists - the main entity in our app
// Stores metadata and list of tracks
import mongoose, { Document, Schema } from 'mongoose';

export interface Playlist extends Document {
  title: string;
  isPublic: boolean;
  owner: string;          // References public-facing userId
  tracklist: string[];    // Array of track IDs
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: String,
      required: true,
      ref: 'User',
    },
    tracklist: {
      type: [String], // Array of track IDs as strings
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// better query performance
PlaylistSchema.index({ owner: 1 });
PlaylistSchema.index({ isPublic: 1 });

export default mongoose.model<Playlist>('Playlist', PlaylistSchema);