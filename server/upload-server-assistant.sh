#!/bin/bash

# Create the output directory if it doesn't exist
mkdir -p forServerAssistant

# Function to copy a file with path transformation
copy_file() {
  local src="$1"
  if [ -f "$src" ]; then
    # Transform the filepath to use underscores instead of slashes
    local dest_name=$(echo "$src" | sed 's/\//_/g')
    local dest="forServerAssistant/$dest_name"
    cp "$src" "$dest"
    echo "Copied $src to $dest"
  else
    echo "Skipping $src (not found)"
  fi
}

# Copy essential configuration files
copy_file "package.json"
copy_file "tsconfig.json"

# Copy server entry point
copy_file "src/server.ts"

# Copy configuration files
copy_file "src/config/auth0.config.ts"
copy_file "src/config/db.config.ts"

# Copy controllers
copy_file "src/controllers/playlist.controller.ts"
copy_file "src/controllers/tag.controller.ts"
copy_file "src/controllers/track.controller.ts"
copy_file "src/controllers/user.controller.ts"

# Copy middleware
copy_file "src/middleware/auth.middleware.ts"

# Copy models
copy_file "src/models/index.ts"
copy_file "src/models/playlist.model.ts"
copy_file "src/models/tag.model.ts"
copy_file "src/models/track.model.ts"
copy_file "src/models/user.model.ts"

# Copy routes
copy_file "src/routes/playlist.routes.ts"
copy_file "src/routes/tag.routes.ts"
copy_file "src/routes/track.routes.ts"
copy_file "src/routes/user.routes.ts"

# Copy type definitions
copy_file "src/types/express/index.d.ts"

# Create a prompt file for the AI assistant
cat > forServerAssistant/prompt.txt << 'EOF'
# Node.js/Express Server Code Assistant Prompt

## Project Context
You are assisting with a Node.js/Express backend for a playlist management application with Auth0 authentication. This is part of a monorepo fullstack application with a React frontend. The backend provides:
- RESTful CRUD endpoints for playlists, tracks, tags, and users
- Authentication middleware for protected routes
- MongoDB with Mongoose for data persistence
- Authorization rules (users can only access their own non-public playlists)

## Technical Stack
- Node.js with Express
- TypeScript for type safety
- MongoDB with Mongoose
- Auth0 for authentication
- RESTful API architecture

## Key Files Organization
- `config/`: Configuration for Auth0 and database
- `controllers/`: Request handlers for each resource
- `middleware/`: Authentication middleware
- `models/`: Mongoose schema definitions
- `routes/`: Express route definitions
- `types/`: TypeScript type definitions
- `server.ts`: Main server entry point

## Code Standards
- TypeScript interfaces without 'I' prefixes
- Async/await over Promise chains
- Modern JavaScript features (optional chaining, nullish coalescing)
- Explicit type annotations for parameters/returns
- RESTful API conventions

## Your Role
As the server code assistant, your job is to:
1. Help debug authentication/authorization issues
2. Assist with API endpoint implementation
3. Troubleshoot database interactions
4. Provide guidance on implementing missing features
5. Ensure code follows the project's standards and patterns

When answering questions:
- Keep responses brief and focused on the issue
- Assume basic Node.js/Express knowledge
- Format code according to the project standards
- Prioritize security/authentication concerns
- Suggest improvements that align with the minimalist MVP approach

## Authentication Flow
The application uses Auth0 for authentication. The auth middleware verifies the JWT from Auth0 and adds the user information to the request object. Protected routes require authentication, and authorization checks ensure users can only access resources they own or that are marked as public.

## API Structure
The API follows RESTful conventions with endpoints for:
- `/api/playlists`: CRUD operations for playlists
- `/api/tracks`: CRUD operations for tracks
- `/api/tags`: CRUD operations for tags
- `/api/users`: User profile operations

Each resource follows the controller-route pattern, with controllers handling the business logic and routes defining the endpoints.
EOF

echo "Server files copied to forServerAssistant/ directory with prompt"
