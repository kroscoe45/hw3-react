import mongoose, { Document, Schema } from 'mongoose';

export type TrackId = string;

export interface ITrack {
    trackId: string;
    title: string;
    artist: string;
    addedAt: Date;
}

const TrackSchema: Schema = new Schema({
 trackId: {
   type: String,
   required: true,
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

export { TrackSchema };