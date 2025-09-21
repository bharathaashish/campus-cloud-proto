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

Running frontend and backend together

If you have separate `frontend` and `backend` folders with their own start scripts, you can run both at once using `concurrently` from the root.

1. Install concurrently as a dev dependency (if not installed):

```bash
npm install -D concurrently
```

2. From the root, run:

```bash
npm start
```

This uses the `start` script in `package.json` to run:
`npm start --prefix frontend` and `npm start --prefix backend` concurrently.
