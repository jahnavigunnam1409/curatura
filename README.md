# Curatura — Interactive Art Curation Platform

An interactive web platform where users can curate, remix, and reimagine art. Curation becomes a creative act, not just viewing.

## Overview

Curatura enables users to:
- **Play with Already Curated Art**: Remix and rearrange existing curated frames
- **Create Your Own Curation**: Select artworks, assign them to frames, arrange layouts, and generate narratives

## Key Features

### 🎨 Interactive Curation
- Drag-and-drop interface for artwork arrangement
- Multiple frame layouts and wall configurations
- Real-time narrative generation based on artwork order

### 🔄 Remix Culture
- Rearrange artworks within existing curated frames
- Create new frame versions while maintaining attribution
- Save and share your remixed curations

### 📖 Narrative Building
- Each artwork has an associated story line
- Narratives emerge from artwork order and frame grouping
- Multiple permutations create unique storytelling experiences

### 📊 Analytics & Tracking
- Track artwork selection frequency
- Monitor most remixed frames
- Understand curatorial behavior patterns

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **Routing**: React Router
- **State Management**: TanStack Query (React Query)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Installation

```sh
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd curation

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── ArtworkThumbnail.tsx
│   ├── FrameCard.tsx
│   └── ...
├── pages/              # Route pages
│   ├── Index.tsx       # Landing page
│   ├── PlayCurated.tsx # Remix existing curations
│   └── CreateCuration.tsx # Create new curation
├── data/               # Mock data and data models
├── hooks/              # Custom React hooks
└── lib/                # Utility functions
```

## Roadmap

- [ ] User authentication (Google Sign-In + Email/Password)
- [ ] Backend API integration
- [ ] Database setup for curations and analytics
- [ ] User profiles and curation history
- [ ] Social sharing features
- [ ] AI-powered recommendations

## License

MIT
