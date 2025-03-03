// Connects Auth0 users with our app's user records
// Stores basic profile info and a public ID for references
import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface User extends Document {
  auth0Id: string;
  userId: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    auth0Id: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4(),
    },
    username: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<User>('User', UserSchema);