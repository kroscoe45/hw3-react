import mongoose, { Document, Schema } from 'mongoose';

export interface Tag extends Document {
    name: string;
    playlists: string[]; // Playlist IDs this tag is associated with
    upvotes: string[];   // User IDs of users who upvoted
    downvotes: string[]; // User IDs of users who downvoted
    createdAt: Date;
    updatedAt: Date;
}

const TagSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 2,
        maxlength: 20
    },
    playlists: {
        type: [String],
        default: []
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
TagSchema.index({ playlists: 1 });

export default mongoose.model<Tag>('Tag', TagSchema);