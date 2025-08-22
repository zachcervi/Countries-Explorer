# 🌍 Countries Explorer

A React + Vite application that allows users to explore information about different countries.  
Built with modern tooling, tested with Vitest, and deployed via Firebase.

---
## Tech Stack

- React 19
- Vite
- React Router v7
- Firebase Hosting
- Vitest
  + Testing Library
---

## 🚀 Running the App

### Prerequisites

- **Node.js** (>=18 recommended)
- **npm** (comes with Node)

### Install dependencies

```bash
npm install
```
```bash
npm run dev
```

## Running Tests
##### Interactive test runner
```bash
npm run test
```

##### Run tests once
```bash
npm run test:run
```

##### Coverage report
```bash
npm run test:coverage
```

##### UI test runner
```bash
npm run test:ui
```

## Build For Production
```bash
npm run build
```
##### Preview Production build
```bash
npm run build
```

## Deploy to Firebase
```bash
npm run deploy
```
[Hosted -> Countries Explorer](https://countries-explorer-c8b7b.web.app/)

---
###### Decisions & Trade Offs:
- Next time I would have started with React Router in the beginning. I usually do, but I wanted to focus on TDD

- Used Vite + React 19 for speed, simplicity and modern React Support

- I used Vitest + Testing Library since it is integrated nicely with Vite.

- Firebase Hosting is simple.

---
###### If I had more time:
- Enhance accessibility (keyboard navigation, screen reader support)

- Add CI/CD pipeline (linting, testing, deployment via GitHub Actions)

- Implement API caching/offline support (SWR, React Query, Service Workers)

- Add end-to-end testing (Cypress)

- Expand features (search filters, sorting, favorites)

 - Create a User Account