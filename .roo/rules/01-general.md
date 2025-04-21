# General Guidelines for Modern TypeScript Web Development

As a senior front-end engineer, your goal is to write modern, scalable, and maintainable code that prioritizes developer experience, accessibility, and performance. This project embraces best practices from the modern web ecosystem: TypeScript, React, TailwindCSS, Zod, TanStack Query, and Shadcn/ui.

## 🧠 Philosophy
- Use modern, declarative, and functional patterns.
- Prioritize readability, accessibility, and user experience.
- Optimize for performance without sacrificing maintainability.

## 🧱 Architecture & Structure
- Use **functional components** only. Avoid class components.
- Organize code with clear separation of concerns:
  - `components/` – reusable UI parts
  - `hooks/` – custom React hooks
  - `lib/` – utility functions and services
  - `types/` – TypeScript type definitions
  - `pages/` – page-level components or routes

## 🔗 Type Safety
- Type all props, return values, and variables explicitly.
- Prefer `type` or `interface` instead of `any`.
- Use **Zod** for runtime schema validation.
- Infer types from Zod schemas using `z.infer`.

## 🧪 Data Handling
- Use **TanStack Query** (`useQuery`, `useMutation`) for API calls.
- Handle loading, error, and empty states.
- Cache and invalidate queries appropriately.

## 📋 Forms & Validation
- Use **React Hook Form** with **Zod** integration.
- Ensure all fields are typed and validated.

## 🎨 Styling
- Use **TailwindCSS** utility-first classes only.
- Avoid CSS Modules and inline styles.
- Ensure visual hierarchy and spacing consistency.

## ♿ Accessibility
- Use semantic HTML elements.
- Label all inputs clearly.
- Manage focus and ARIA attributes where needed.

## 🧹 Clean Code
- Keep functions pure and small.
- Reuse logic through custom hooks and utilities.
- Remove unused code and console logs before committing.

## 🔧 Tooling
- Follow ESLint and Prettier defaults.
- Run linters and formatters on commit (e.g., via Husky/Pre-commit hooks).

## 💡 AI Usage
- Prefer concise code suggestions.
- When unsure, ask AI assistants for examples, then adapt with project style in mind.

## 📘 Project Workflow & Conventions

### 🧾 Documentation

- When implementing a new feature, create a `docs/design.md` file that includes:
  - A concise requirements summary
  - A design overview including component structure and data flow
- For modifications to existing features, update the corresponding section in `docs/design.md`
- Before implementing code, review and confirm the design with your team

### 🧑‍💻 Coding Standards

- Follow strict ESLint and Prettier configurations for formatting
- Write `JSDoc` or `TSDoc` style comments for exported functions and components
- Use consistent naming and folder structure based on feature or domain
- Favor composition over inheritance; break down large components into smaller parts

### 🧪 Testing

- Use `Vitest` for unit testing
- Mirror the directory structure inside `tests/` to match `src/`
- Write meaningful, isolated tests and run them before committing
- Ensure all tests pass using `yarn test` or `vitest run`

### 🔄 Git Operations

- Always check your working status using `git status`
- Use `git mv` and `git rm` when refactoring files or components
- Write descriptive, conventional commits (e.g., `feat:`, `fix:`, `refactor:`)

### 🚀 Pull Requests (PR)

#### When creating a PR:

- Review your diffs before pushing using `git diff` or `gh pr diff`
- Use a consistent PR description format (consider `.github/pull_request_template.md` if available)
- Highlight what changed, why it changed, and any impact

#### When reviewing PRs:

1. Review code for clarity, performance, and maintainability
2. Confirm that styling, typing, and accessibility standards are met
3. Test the PR locally if necessary before approval
