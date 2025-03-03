// just basic metadata since we're not actually playing music
import mongoose, { Document, Schema } from 'mongoose';

export interface Track extends Document {
    trackId: string;
    title: string;
    artist: string;
    addedAt: Date;
}

const TrackSchema: Schema = new Schema({
  trackId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for better query performance
TrackSchema.index({ trackId: 1 });
TrackSchema.index({ artist: 1 });

export default mongoose.model<Track>('Track', TrackSchema);