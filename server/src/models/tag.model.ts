// server/src/models/tag.model.ts
import mongoose, { Document, Schema } from 'mongoose';

/* 
 * This file defines the Tag model for playlist tags in the application.
 * Tags can be associated with playlists and include upvote/downvote functionality.
 */

export interface Tag extends Document {
    name: string;
    upvotes: string[]; // User IDs of users who upvoted
    downvotes: string[]; // User IDs of users who downvoted
}

const TagSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    upvotes: {
        type: [String],
        default: []
    },
    downvotes: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
TagSchema.index({ name: 1 });

export default mongoose.model<Tag>('Tag', TagSchema);