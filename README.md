# osu! Replay Analyzer

A desktop application built with Electron for analyzing osu! replay files.

## Project Structure

- **src/main/**: Main process files
- **src/main/ipc/**: IPC handlers for communication
- **src/preload/**: Preload scripts for secure IPC bridge
- **src/renderer/**: Renderer process (React UI)
- **src/renderer/pages/**: Page components (Home, Analyze)
- **src/renderer/routes.tsx**: Router configuration using Tanstack Router

### Getting Started

1. Install dependencies: `npm install`
2. Start development: `npm run start`
3. Build for production: `npm run make`