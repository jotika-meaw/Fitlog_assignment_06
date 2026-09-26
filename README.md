# FitLog — Workout Library

FitLog is a responsive workout-library and daily training-log web app built for the Programming Hero B14-A6 assignment. It follows the supplied FitLog UI direction: dark surfaces, high-contrast typography, lime accent, compact data cards, and focused workout actions.

## Live/API

- Workout API: `https://api.abcz.workers.dev/api/fitlog`
- Single workout API: `https://api.abcz.workers.dev/api/fitlog/:id`

## Technologies

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- CSS custom design system
- Sonner for toast notifications
- Lucide React icons
- Vercel-ready deployment

## Key Features

1. Responsive FitLog home page with hero and workout library.
2. Live API loading with a resilient fallback library if the API is unavailable.
3. Dynamic workout detail pages with specs, instructions, plan and save actions.
4. My Plan page with Today's Plan / Saved tabs and live metrics.
5. Five-lift daily plan cap with disabled state and feedback.
6. Mark as Done and Remove actions with toast notifications.
7. Duration / Calories / Rating sorting plus workout/tag search.
8. LocalStorage persistence for plan and saved workouts.
9. Custom 404 page and deployment-safe App Router routes.
10. Responsive layouts for mobile, tablet and desktop.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Test

```bash
npm run build
npm start
```

## Deployment

Import the repository into Vercel. No environment variables are required for the provided API.

## Suggested meaningful Git commits

If starting from a clean repository, use commits such as:

1. `chore: initialize nextjs fitlog project`
2. `feat: add fitlog design system and responsive layout`
3. `feat: add api workout library and loading state`
4. `feat: add workout detail page and actions`
5. `feat: add my plan and saved workout tabs`
6. `feat: add local persistence and plan limit`
7. `feat: add sorting search to workout library`
8. `fix: add 404 page and deployment-safe states`
9. `docs: add professional project readme`
