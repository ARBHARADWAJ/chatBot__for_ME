# AI Agent Instructions for chatBot\_\_for_ME

## Project Overview

This is a full-stack chat application with real-time messaging capabilities using Socket.IO. The project is split into Frontend (React/Vite) and Backend (Express.js) components with MongoDB and Redis for data storage.

## Architecture

### Frontend Structure

- Built with React + Vite
- Key directories:
  - `Frontend/src/components/` - Reusable UI components
  - `Frontend/src/pages/` - Main application pages (Chat, Login, Register, Dashboard)
  - `Frontend/src/hooks/` - Custom React hooks (notably `useChatSocket.js` for WebSocket management)
  - `Frontend/src/context/` - React context providers (AuthContext for authentication state)

### Backend Structure

- Express.js server with Socket.IO integration
- Key components:
  - `Backend/Controller/` - Business logic handlers
  - `Backend/Routes/` - API route definitions
  - `Backend/Models/` - MongoDB schemas
  - `Backend/Config/` - Database and Redis configuration
  - `Backend/Utils/` - Helper functions and chat utilities

## Key Patterns

### Authentication Flow

- JWT-based authentication using cookies
- Token verification in `Backend/Middleware/auth.middleware.js`
- Protected routes pattern in `Frontend/components/ProtectedRoutes.jsx`

### Real-time Communication

- Socket.IO for bi-directional communication
- Socket connection established in `Frontend/src/hooks/useChatSocket.js`
- Server-side socket handling in `Backend/server.js`
- Chat sessions and messages managed through `Backend/Controller/chat.controller.js`

### Data Flow

1. Chat messages flow through Socket.IO events
2. Sessions are persisted in MongoDB
3. Redis used for caching and temporary data storage

## Development Workflow

### Starting the Application

1. Backend:
   ```bash
   cd Backend
   npm install
   npm run dev
   ```
2. Frontend:
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

### Environment Setup

- Required environment variables (in Backend/.env):
  - `JWT_SECRET`
  - `MONGODB_URI`
  - `REDIS_URL`

### Database Setup

- MongoDB and Redis instances are configured via Docker Compose
- Configuration files in `Backend/Config/mongodb/docker-compose.yml` and `Backend/Config/redis/docker-compose.yml`

## Common Tasks

### Adding New API Endpoints

1. Create controller in `Backend/Controller/`
2. Add route in `Backend/Routes/`
3. Register route in `Backend/server.js`

### Adding New Chat Features

1. Add socket event handler in `Backend/server.js`
2. Update `Frontend/src/hooks/useChatSocket.js` with new events
3. Add corresponding UI components in `Frontend/src/components/`

## Integration Points

- Frontend connects to Backend on `http://localhost:3000`
- WebSocket connection uses same host with Socket.IO
- MongoDB runs on default port 27017
- Redis runs on default port 6379
