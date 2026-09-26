# KSRA Academy Website Builder

An administrative Content Management System (CMS) and real-time live website builder for Kerala State Rifle Association (KSRA) academies, state, and district bodies.

## Features

- **Multi-Type Support**: Seamlessly toggle and manage content structures for Sub-Academy, State, and District websites.
- **Dual-Pane Experience**: Side-by-side content editor and live interactive website preview with multi-device frames (Desktop, Tablet, Mobile).
- **Strict Validation Engine**: Real-time inline field validation, character counters, format checkers (10-digit phone, valid URLs, image requirements), and robust Publish blockers across all sections.
- **Auto-Navigation on Error**: Automatically expands the invalid section, highlights errors, and smoothly scrolls/focuses directly on the field requiring correction.
- **Draft & Publish Workflows**: Local state management with Save Draft and Publish capabilities.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm, yarn, or bun

### Installation

```sh
npm install
```

### Development Server

Start the local development server:

```sh
npm run dev
```

### Production Build

```sh
npm run build
```

## Technology Stack

- **Framework**: React 19, TanStack Start & TanStack Router
- **State & Data**: TanStack Query, React Hook Form, Zod
- **Styling & UI**: Tailwind CSS, Radix UI primitives, Lucide Icons, Sonner Notifications
