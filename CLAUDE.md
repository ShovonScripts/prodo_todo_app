# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern, responsive todo list dashboard built with React, Vite, and Tailwind CSS. The application features a glassmorphism UI with real-time statistics, filtering, and local storage persistence.

## Tech Stack

- **React 18** - UI library with functional components and hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework with custom color theme
- **Lucide React** - Icon library
- **Local Storage** - Client-side data persistence

## Project Structure

```
src/
├── main.jsx                    # Application entry point
├── App.jsx                     # Root component with state management
├── index.css                   # Global styles and Tailwind directives
├── components/
│   ├── Stats.jsx               # Statistics sidebar (progress, counts)
│   ├── FilterBar.jsx           # Filter buttons (All/Active/Completed)
│   ├── TodoForm.jsx            # Input form for adding new todos
│   ├── TodoList.jsx            # Container for todo items
│   └── TodoItem.jsx            # Individual todo component (inlined in TodoList)
```

### Architecture Notes

- **State Management**: All todo state lives in `App.jsx` using `useState`. Includes id, text, completed status, and createdAt timestamp.
- **Data Persistence**: Todos are automatically saved to `localStorage` on any change via `useEffect` in `App.jsx`.
- **Filtering Logic**: Filtered todos are computed in `App.jsx` based on the `filter` state ('all', 'active', 'completed').
- **Component Props**: Props are consistently named with verb-first convention (`onAdd`, `onToggle`, `onDelete`, `onFilterChange`).

## Common Development Tasks

### Setup & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### File Paths

- Main component: `src/App.jsx`
- Components directory: `src/components/`
- Styling: `src/index.css` (global) + Tailwind utilities
- Build config: `vite.config.js` + `tailwind.config.js`

### Adding New Features

When extending the todo system:
1. State updates in `App.jsx` should follow the immutable pattern (create new arrays/objects)
2. Use localStorage for persistence - it's already wired up
3. New components go in `src/components/` with `.jsx` extension
4. Use Tailwind's utility classes for styling with the custom `primary` color scheme
5. Use Lucide icons for consistency

### Design Patterns

- **Backdrop blur effects**: Use `backdrop-blur-md` with `bg-white/10` for glass effect
- **Color scheme**: Primary blue (`0ea5e9`), white text on dark gradient background
- **Responsive grid**: Stats sidebar collapses to full-width on mobile (`lg:col-span-1` / `lg:col-span-3`)
- **Animations**: Subtle fade-in and scale transitions on hover/interaction
- **Accessibility**: Include proper labels on buttons, use semantic HTML where possible

### Testing

No tests are currently configured. If adding tests:
- Use Vitest with React Testing Library
- Place test files alongside components with `.test.jsx` extension
- Focus on testing toggle/delete/filter logic in `App.jsx`

## Notes

- The app uses a purple gradient background (`#667eea` to `#764ba2`)
- Todo items are stored in localStorage with key `'todos'`
- Completed items can be bulk-cleared via the "Clear Completed" button in Stats
- No backend required - fully client-side
- Icons from Lucide React: `CheckSquare`, `Square`, `Plus`, `Trash2`, `ListTodo`, `Clock`, `ListChecks`
