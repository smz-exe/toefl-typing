<!-- .github/pull_request_template.md -->

## 📝 Summary

<!-- What does this PR do? -->
Describe the purpose of the PR in 1-2 sentences.

---

## ✅ Related Issues / Tickets

<!-- Link to any related issues or GitHub discussions -->
- Closes #123
- Related to #456

---

## 🛠️ Changes

<!-- Brief summary of changes made in this PR -->
- Added `LoginForm` component with React Hook Form and Zod validation
- Integrated TailwindCSS styles
- Created API mock for `/api/login`
- Added unit test with Vitest

---

## 🧪 Testing

<!-- How was this tested? What manual/automated tests were performed? -->
- [ ] All unit tests pass (`yarn test`)
- [ ] Manual UI testing completed on desktop and mobile
- [ ] Edge cases and error states tested

---

## 🖼️ Screenshots / Demo

<!-- If applicable, provide before/after screenshots or GIFs -->
| Before | After |
|--------|-------|
| ❌     | ✅     |

---

## 📚 Checklist

- [ ] Code follows project coding conventions (ESLint + Prettier)
- [ ] TypeScript types are explicit and valid
- [ ] Zod schema validations are included where necessary
- [ ] TailwindCSS styles follow visual and accessibility guidelines
- [ ] This PR includes necessary docs (`docs/design.md`) if applicable
- [ ] No `console.log` or unused code

---

## 🧠 Notes for Reviewers

<!-- Anything reviewers should focus on or keep in mind -->
- Pay extra attention to error boundary handling
- Feedback welcome on the folder structure of new components