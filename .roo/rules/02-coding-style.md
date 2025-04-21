# Coding Style Guidelines

## Formatting
- **Indentation**: 2 spaces
- **Quotes**: Single (`'`), except for JSX props
- **Semicolons**: Always use them
- **Line length**: Max 100 characters
- **Trailing commas**: Yes, wherever possible

## Variables & Functions
- Use `const` by default; use `let` only for reassignment
- Use `camelCase` for variables/functions, `PascalCase` for components/types
- Use arrow functions for all components and callbacks
- Use meaningful and descriptive names

## React
- Always use **functional components** (`React.FC` or arrow)
- Destructure props and avoid spreading entire props objects
- Group hooks at the top of the component

## TypeScript
- Prefer `type` or `interface` over `any`
- Explicitly define types for function parameters and return types
- Use `z.infer<typeof Schema>` for Zod schema types
- Avoid non-null assertions (`!`) unless necessary

## TailwindCSS
- Class order: layout → spacing → typography → color → state
- Avoid deep nesting of `div`s; use semantic elements
- Don't override Tailwind with custom CSS unless essential

## Components
- Create small, focused components with a single responsibility
- Co-locate test files and story files next to components if applicable
- Prefer using **Shadcn/ui** for consistency and accessibility

## Git & Comments
- Use conventional commit messages (e.g., `feat:`, `fix:`, `refactor:`)
- Use comments only when necessary to explain _why_, not _what_
- Clean up unused code and remove debugging logs before commits
