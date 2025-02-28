
#!/bin/bash

# Step 1: Remove all node_modules folders and package-lock.json files
echo "Removing all node_modules folders and lock files..."
find . -name "node_modules" -type d -exec rm -rf {} +
find . -name "package-lock.json" -type f -delete
find . -name "yarn.lock" -type f -delete

# Step 2: Clean up root package.json to only include monorepo management dependencies
echo "Backing up root package.json..."
cp package.json package.json.backup

echo "Creating clean root package.json..."
cat > package.json << EOF
{
  "name": "playlist-manager-monorepo",
  "version": "1.0.0",
  "description": "Monorepo for Playlist Manager application",
  "private": true,
  "workspaces": [
    "client",
    "server"
  ],
  "scripts": {
    "client": "cd client && npm run dev",
    "server": "cd server && npm run dev",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm run build",
    "build:server": "cd server && npm run build"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
EOF

# Step 3: Install only the necessary dependencies in each location
echo "Installing root dependencies..."
npm install

echo "Setting up client dependencies..."
cd client
cat > package.json << EOF
{
  "name": "playlist-manager-client",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@auth0/auth0-react": "^2.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
EOF
npm install
cd ..

echo "Setting up server dependencies..."
cd server
cat > package.json << EOF
{
  "name": "playlist-manager-server",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "tsc",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-jwt": "^8.4.1",
    "express-oauth2-jwt-bearer": "^1.5.0",
    "mongoose": "^7.4.3",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@types/node": "^20.5.0",
    "@types/uuid": "^9.0.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.1.6"
  }
}
EOF
npm install
cd ..

echo "Dependency cleanup and reinstallation complete!"