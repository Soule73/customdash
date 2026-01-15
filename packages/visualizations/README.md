# @customdash/visualizations

Composants de visualisation de donnees pour l'application CustomDash.

## Installation

```typescript
import { BarChart, LineChart, PieChart, KPIWidget, CardWidget } from '@customdash/visualizations';
```

## Composants

| Composant | Description |
|-----------|-------------|
| **BarChart** | Graphique en barres (Chart.js) |
| **LineChart** | Graphique en lignes avec remplissage et tension |
| **PieChart** | Graphique circulaire |
| **KPIWidget** | Widget KPI avec valeur, tendance et formatage |
| **CardWidget** | Carte KPI avec icone |

## Types principaux

| Type | Description |
|------|-------------|
| **ChartConfig** | Configuration des graphiques (metrics, buckets, filters, styles) |
| **Metric** | Agregation (sum, avg, count, min, max) sur un champ |
| **Bucket** | Dimension de regroupement |
| **Filter** | Filtre sur les donnees |

## Dependances

- chart.js ^4.0.0
- react-chartjs-2 ^5.0.0

## Storybook

```bash
yarn storybook
```
