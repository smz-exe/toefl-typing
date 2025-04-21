# TypeScript Best Practices

- Enable `strict` mode in `tsconfig.json`
- Use interfaces or type aliases for all object types
- Prefer `readonly` and `const` for immutability
- Use discriminated unions for variant-based logic
- Avoid type assertions unless absolutely necessary
- Always infer from schema when using Zod
- Avoid using non-null assertions (`!`) unless justified