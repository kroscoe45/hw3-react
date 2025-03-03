// routes/index.tsx
import { Route, Routes } from 'react-router-dom';

// Page components
import HomePage from '../pages/HomePage';
import PublicPlaylistsPage from '../pages/PublicPlaylistsPage';
import UserPlaylistsPage from '../pages/UserPlaylistsPage';
import PlaylistDetailPage from '../pages/PlaylistDetailPage';
import CreatePlaylistPage from '../pages/CreatePlaylistPage';
import EditPlaylistPage from '../pages/EditPlaylistPage';
import NotFoundPage from '../pages/NotFoundPage';

// Auth component
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Layout
import Layout from '../components/layout/Layout';

// Main router component
const AppRouter = (): JSX.Element => {
  return (
    <Routes>
      {/* 
        struggled with this for like 2 hours before I figured it out
      */}
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/playlists/public" element={<PublicPlaylistsPage />} />
        
        {/* Protected routes - Auth checking handled by ProtectedRoute component */}
        <Route 
          path="/playlists" 
          element={
            <ProtectedRoute>
              <UserPlaylistsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/playlists/create" 
          element={
            <ProtectedRoute>
              <CreatePlaylistPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/playlists/:id/edit" 
          element={
            <ProtectedRoute>
              <EditPlaylistPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
        
        {/* Catch all for 404 - always put this last */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;