# Modern TypeScript Web Template

A production-ready React TypeScript template with best practices for modern web development.

## 🚀 Features

- **TypeScript** - Type-safe code
- **React** - Functional components with hooks
- **Vite** - Fast development and optimized builds
- **TailwindCSS** - Utility-first styling
- **Shadcn/ui** - Accessible UI components
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **Zustand** - Lightweight state management
- **Vitest** - Unit testing
- **Code Splitting** - Lazy loading for optimal performance

## 📦 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # Shadcn/ui components
│   └── layout/       # Layout components
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Page components
├── services/         # API services
├── store/            # Zustand stores
└── types/            # TypeScript type definitions
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 16+
- Yarn or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/smz-exe/typescript-modern-web-boilerplate.git
cd typescript-modern-web-boilerplate

# Install dependencies
yarn install
```

### Development

```bash
# Start development server
yarn dev
```

### Building for Production

```bash
# Build for production
yarn build

# Preview production build
yarn preview
```

### Testing

```bash
# Run tests
yarn test

# Run tests with coverage
yarn test:coverage
```

## 🧩 Key Components

### Authentication

The template includes a basic authentication system with:

- Login page with form validation
- JWT-based authentication (mock implementation)
- Protected routes
- User state management with Zustand

### UI Components

Shadcn/ui components included:

- Button (with variants)
- Dialog
- Tooltip
- Tabs
- And more...

### Form Handling

- Form validation with Zod schemas
- React Hook Form integration
- Error handling and feedback

### Data Fetching

- TanStack Query for data fetching and caching
- Type-safe API services
- Loading and error states

### Performance Optimizations

- Code splitting with lazy loading
- Optimized bundle size with manual chunks
- Image optimization with vite-imagetools

## 📝 Best Practices

This template follows these best practices:

- **Component Structure** - Small, focused components with clear responsibilities
- **Type Safety** - Comprehensive TypeScript types for all components and functions
- **Accessibility** - ARIA attributes and keyboard navigation
- **Performance** - Code splitting, lazy loading, and optimized builds
- **Testing** - Unit tests for components and utilities
- **State Management** - Local state with hooks, global state with Zustand
- **Code Quality** - ESLint and Prettier for consistent code style

## 🔄 Extending the Template

### Adding New Pages

1. Create a new file in `src/pages/`
2. Add the route to `App.tsx`
3. Add a link in the navigation component

### Adding New Components

1. Create a new file in `src/components/`
2. Export the component
3. Import and use it in your pages

### Adding New API Services

1. Add new methods to the API service in `src/services/`
2. Create custom hooks in `src/hooks/` to use the API

## 📚 Learn More

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
