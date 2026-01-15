# CustomDash

Frontend React pour la plateforme de visualisation de donnees CustomDash.

## Stack Technique

- **React 19** + **TypeScript 5.9**
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **React Query** - Data fetching
- **React Router DOM 7** - Routing
- **Chart.js** + **react-chartjs-2** - Visualisations
- **React Grid Layout** - Dashboard layouts

## Architecture

Le projet suit une **Clean Architecture** avec separation des responsabilites :

```
src/
  core/           # Types, constantes, utilitaires
  application/    # Stores Zustand, hooks metier
  data/           # Services HTTP, repositories
  domain/         # Entites et regles metier
  infrastructure/ # Implementations externes
  presentation/   # Composants React, pages
  styles/         # CSS et Tailwind
```

### Packages Workspace

Le projet utilise des workspaces Yarn pour les packages partages :

- **[@customdash/ui](packages/ui/README.md)** - Composants UI reutilisables (Button, Input, Card, Modal, Spinner)
- **[@customdash/visualizations](packages/visualizations/README.md)** - Graphiques et widgets (BarChart, LineChart, PieChart, KPI)
- **[@customdash/utils](packages/utils/README.md)** - Utilitaires partages (formatters, helpers, validators)

## Installation

```bash
# Installation des dependances
yarn install

# Demarrage en developpement
yarn dev

# Build production
yarn build
```

## Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Serveur de developpement Vite |
| `yarn build` | Build de production |
| `yarn preview` | Preview du build |
| `yarn test` | Tests unitaires Vitest |
| `yarn test:e2e` | Tests E2E Playwright |
| `yarn storybook` | Documentation des composants |
| `yarn lint` | Linting ESLint |
| `yarn format` | Formatage Prettier |

## Configuration API

Le frontend communique avec deux APIs :

```typescript
// src/core/constants/index.ts
export const CORE_API_URL = 'http://localhost:3002/api/v1';
export const PROCESSING_API_URL = 'http://localhost:3003';
```

Configurez les URLs via les variables d'environnement :

```env
VITE_CORE_API_URL=http://localhost:3002/api/v1
VITE_PROCESSING_API_URL=http://localhost:3003
```

## Docker

### Developpement

```bash
docker build -f Dockerfile.dev -t customdash-dev .
docker run -p 5173:5173 -v $(pwd):/app customdash-dev
```

### Production

```bash
docker build -t customdash .
docker run -p 80:80 customdash
```

## Tests

### Tests Unitaires (Vitest)

```bash
yarn test           # Mode watch
yarn test --run     # Execution unique
yarn test:coverage  # Avec couverture
```

### Tests E2E (Playwright)

```bash
yarn test:e2e       # Execution
yarn test:e2e:ui    # Mode interactif
```

## Storybook

Documentation interactive des composants :

```bash
yarn storybook
```

Accessible sur http://localhost:6006

## Path Aliases

```typescript
@/              -> src/
@components/    -> src/presentation/components/
@pages/         -> src/presentation/pages/
@stores/        -> src/application/stores/
@hooks/         -> src/application/hooks/
@services/      -> src/data/services/
@type/          -> src/core/types/
@utils/         -> src/core/utils/
@customdash/ui  -> packages/ui/src/
@customdash/visualizations -> packages/visualizations/src/
@customdash/utils -> packages/utils/src/
```

## Qualite de Code

- **ESLint** - Linting TypeScript/React
- **Prettier** - Formatage automatique
- **Husky** - Git hooks (pre-commit)
- **Commitlint** - Validation des messages de commit
- **lint-staged** - Linting des fichiers stages

## Conventional Commits

Format des messages de commit :

```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build
```

Exemples :
- `feat(dashboard): add widget drag and drop`
- `fix(auth): resolve token refresh issue`
- `docs: update README with Docker instructions`

## Licence

MIT
