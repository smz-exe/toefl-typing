# React Coding Practices

- Use functional components exclusively
- Structure components with hooks at the top (e.g., `useState`, `useEffect`)
- Compose hooks (`useXyz`) for logic abstraction
- Place UI components in `src/components/`, hooks in `src/hooks/`
- Use TailwindCSS for styling. Do not use external CSS unless required
- Use `@/` aliasing for imports
- Use Shadcn/ui components when applicable for design consistency
- Always handle loading, error, and empty states when fetching data
- Validate props and API responses with Zod
- Ensure all form inputs are connected to React Hook Form and validated