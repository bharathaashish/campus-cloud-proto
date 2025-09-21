# Campus Cloud - Prototype

Minimal React + Vite prototype for a resource-sharing dashboard. Includes basic routing and a simple context-based store.

Getting started

1. Install dependencies

```bash
cd /Users/bharathaashish/Desktop/Cloud\ campus\ proto
npm install
```

2. Run the dev server

```bash
npm run dev
```

Project layout (important files)

- `index.html` - app entry
- `src/main.jsx` - React entry, wraps App with Router and AppProvider
- `src/App.jsx` - routing and top-level layout
- `src/context/AppContext.jsx` - simple app store (user, posts)
- `src/components/*` - Home, Login, Post, SearchBar, Featured

Notes

- This is a small scaffold. You can replace JS with TypeScript or expand the store to use reducers or Zustand/Redux.
