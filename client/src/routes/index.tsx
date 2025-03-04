// routes/index.tsx
import { Route, Routes } from 'react-router-dom';

// Page components
import HomePage from '../pages/HomePage';
import PublicPlaylistsPage from '../pages/PublicPlaylistsPage';
import UserPlaylistsPage from '../pages/UserPlaylistsPage';
import PlaylistDetailPage from '../pages/PlaylistDetailPage';
import CreatePlaylistPage from '../pages/CreatePlaylistPage';
import EditPlaylistPage from '../pages/EditPlaylistPage';
import RequireCompleteProfile from '../components/auth/RequireCompleteProfile';
import AccountDetailsPage from '../pages/AccountDetailsPage';
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
        {/* Account route */}
        <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <AccountDetailsPage />
            </ProtectedRoute>
          } 
        />

        {/* Protected routes - Auth checking handled by ProtectedRoute component */}
        {/* We also protect the pages from users who need to set a display name still*/}
        <Route 
          path="/playlists" 
          element={
            <ProtectedRoute>
              <RequireCompleteProfile>
                <UserPlaylistsPage />
              </RequireCompleteProfile>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/playlists/create" 
          element={
            <ProtectedRoute>
              <RequireCompleteProfile>
                <CreatePlaylistPage />
              </RequireCompleteProfile>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/playlists/:id/edit" 
          element={
            <ProtectedRoute>
              <RequireCompleteProfile>
                <EditPlaylistPage />
              </RequireCompleteProfile>
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