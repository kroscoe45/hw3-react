// Main server entry point - sets up Express and all the routes
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/db.config';

// Import routes
import playlistRoutes from './routes/playlist.routes';
import tagRoutes from './routes/tag.routes';
import userRoutes from './routes/user.routes';
import trackRoutes from './routes/track.routes';
import devRoutes from './routes/dev.routes';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectToDatabase();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/playlists', playlistRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tags', tagRoutes); 
app.use('/api/dev', devRoutes);

// Health check endpoint (thought i wouldnt need this, but here we are)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;