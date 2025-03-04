#!/bin/bash

# Create the output directory if it doesn't exist
mkdir -p forClientAssistant

# Function to copy a file with path transformation
copy_file() {
  local src="$1"
  if [ -f "$src" ]; then
    # Transform the filepath to use underscores instead of slashes
    local dest_name=$(echo "$src" | sed 's/\//_/g')
    local dest="forClientAssistant/$dest_name"
    cp "$src" "$dest"
    echo "Copied $src to $dest"
  else
    echo "Skipping $src (not found)"
  fi
}

# Copy essential configuration files
copy_file "package.json"
copy_file "tsconfig.json"
copy_file "vite.config.ts"

# Copy source files
copy_file "src/App.tsx"
copy_file "src/main.tsx"
copy_file "src/types/index.ts"
copy_file "src/types/playlist.ts"
copy_file "src/types/track.ts"
copy_file "src/types/user.ts"
copy_file "src/types/tag.ts"

# Copy auth configuration and providers
copy_file "src/auth/auth.config.ts"
copy_file "src/auth/Auth0Provider.tsx"

# Copy auth components
copy_file "src/components/auth/AuthGuard.tsx"
copy_file "src/components/auth/LoginButton.tsx"
copy_file "src/components/auth/LogoutButton.tsx"
copy_file "src/components/auth/ProtectedRoute.tsx"
copy_file "src/components/auth/RequireCompleteProfile.tsx"

# Copy layout components
copy_file "src/components/layout/Layout.tsx"
copy_file "src/components/layout/Navbar.tsx"

# Copy track components
copy_file "src/components/tracks/AddTrackForm.tsx"
copy_file "src/components/tracks/TrackItem.tsx"
copy_file "src/components/tracks/TrackList.tsx"

# Copy UI containers
copy_file "src/components/ui-containers/TabbedCollectionContainer.tsx"

# Copy hooks
copy_file "src/hooks/UseAuthStatus.ts"

# Copy pages
copy_file "src/pages/HomePage.tsx"
copy_file "src/pages/AccountDetailsPage.tsx"
copy_file "src/pages/CreatePlaylistPage.tsx"
copy_file "src/pages/EditPlaylistPage.tsx"
copy_file "src/pages/PlaylistDetailPage.tsx"
copy_file "src/pages/PublicPlaylistsPage.tsx"
copy_file "src/pages/UserPlaylistsPage.tsx"
copy_file "src/pages/NotFoundPage.tsx"

# Copy routes
copy_file "src/routes/index.tsx"

# Copy services
copy_file "src/services/authService.ts"
copy_file "src/services/playlistService.ts"
copy_file "src/services/tagService.ts"
copy_file "src/services/trackService.ts"

# Create a prompt file for the AI assistant
cat > forClientAssistant/prompt.txt << 'EOF'
# React Client Code Assistant Prompt

## Project Context
You are assisting with a React SPA for playlist management with Auth0 authentication. This is a monorepo fullstack application with a React frontend and Node.js/Express backend. The application allows users to:
- View public playlists without authentication
- Login with Auth0 to access non-public playlists
- Create, view, edit, and delete their own playlists
- Add tracks to playlists

## Technical Stack
- React 18.x with functional components and hooks
- React Router for navigation
- Auth0 for authentication
- TypeScript for type safety
- Stock React state management (no Redux)

## Key Files Organization
- `auth/`: Auth0 configuration and provider
- `components/auth/`: Authentication-related components
- `components/layout/`: Layout components (Navbar, etc.)
- `components/tracks/`: Track-related components
- `hooks/`: Custom React hooks
- `pages/`: Page components
- `routes/`: Application routing configuration
- `services/`: API service calls
- `types/`: TypeScript interfaces

## Code Standards
- TypeScript interfaces without 'I' prefixes
- Functional components with hooks, not classes
- Modern JavaScript features (optional chaining, nullish coalescing)
- Async/await over Promise chains
- Explicit type annotations for parameters/returns

## Your Role
As the client code assistant, your job is to:
1. Help debug authentication-related issues
2. Assist with React component issues
3. Troubleshoot API service integration
4. Provide guidance on implementing missing features
5. Ensure code follows the project's standards and patterns

When answering questions:
- Keep responses brief and focused on the issue
- Assume basic React knowledge
- Format code according to the project standards
- Prioritize security/authentication concerns
- Suggest improvements that align with the minimalist MVP approach

## Authentication Flow
The application uses Auth0 for authentication. Protected routes require authentication, and users can only access their own non-public playlists. The authentication flow includes:
- Auth0Provider at the application root
- AuthGuard for conditional rendering based on auth state
- ProtectedRoute for route-level protection
- RequireCompleteProfile for ensuring user profile completion
EOF

echo "Client files copied to forClientAssistant/ directory with prompt"
