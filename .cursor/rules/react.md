React

Use functional components, never class components.

Use TypeScript and the `.tsx` extension for components.

Keep component state as close as possible to where it will be used.

Pass props explicitly between components. Avoid the spread operator such as `<ComponentName {...props} />`.

Avoid very large components, especially those over 300 lines.

Use the Context API when you need to communicate across different child components.

Use Tailwind to style components. Do not use `styled-components`.

Avoid an excessive number of very small components.

Always use React Query to communicate with the API.

Use the `useMemo` hook to avoid excessive calculations and unnecessary interactions between renders.

Name hooks with the `use` prefix, for example: `useAuth`, `useLocalStorage`, `useUrl`.

Use Shadcn UI components whenever possible.

Before creating a new complex component, ask whether an existing library should be used instead.

Create automated tests for all components.
