#!/bin/bash

# Create a directory for the ordered files
mkdir -p ../ordered_files

# Define the files in order
files=(
  "client/package.json"
  "server/package.json"
  "client/src/auth/auth.config.ts"
  "server/src/config/auth0.config.ts"
  "client/src/auth/Auth0Provider.tsx"
  "client/src/components/auth/LoginButton.tsx"
  "client/src/components/auth/LogoutButton.tsx"
  "client/src/components/auth/ProtectedRoute.tsx"
  "client/src/components/auth/AuthGuard.tsx"
  "client/src/hooks/UseAuthStatus.ts"
  "server/src/middleware/auth.middleware.ts"
  "client/src/routes/index.tsx"
  "client/src/App.tsx"
  "client/src/services/authService.ts"
  "server/src/server.ts"
  "server/src/routes/playlist.routes.ts"
  "server/src/routes/user.routes.ts"
  "server/src/controllers/playlist.controller.ts"
  "server/src/controllers/user.controller.ts"
  "server/src/models/playlist.model.ts"
  "server/src/models/user.model.ts"
  "server/src/models/track.model.ts"
  "server/src/models/tag.model.ts"
  "server/src/models/index.ts"
  "server/src/types/express/index.d.ts"
  "client/src/types/user.ts"
  "client/src/types/playlist.ts"
  "client/src/types/track.ts"
  "client/src/types/index.ts"
  "client/src/services/playlists.service.ts"
  "client/src/pages/HomePage.tsx"
  "client/src/pages/PublicPlaylistsPage.tsx"
  "client/src/pages/UserPlaylistsPage.tsx"
  "client/src/pages/PlaylistDetailPage.tsx"
  "client/src/pages/CreatePlaylistPage.tsx"
  "client/src/pages/EditPlaylistPage.tsx"
  "client/src/pages/NotFoundPage.tsx"
  "client/src/components/layout/Layout.tsx"
  "client/src/components/layout/Navbar.tsx"
  "client/src/main.tsx"
  "server/src/config/db.config.ts"
)

# Create numbered copies of each file
for i in "${!files[@]}"; do
  file="${files[$i]}"
  num=$((i + 1))
  
  # Check if the file exists
  if [ -f "$file" ]; then
    # Extract just the filename without the path
    filename=$(basename "$file")
    
    # Create a copy with the number prepended to the filename
    cp "$file" "../ordered_files/${num}_${filename}"
    echo "Created ../ordered_files/${num}_${filename} from $file"
  else
    echo "Warning: File $file does not exist"
  fi
done

echo "Done! Files have been copied to the ordered_files directory with numbered filenames."