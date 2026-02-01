# Configuration Utilisateur Centralisée

**Version** : 1.0.0  
**Dernière mise à jour** : Session actuelle

---

## Vue d'ensemble

CustomDash utilise une configuration utilisateur centralisée pour gérer les préférences de formatage à travers toute l'application. Cette configuration affecte :

- **Formatage des nombres** : Séparateurs décimaux et de milliers
- **Formatage des devises** : Symbole, position, code devise
- **Formatage des dates** : Format court/long, locale
- **Valeur null** : Représentation des valeurs manquantes

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                        │
│                                                              │
│  ┌──────────────────┐     ┌────────────────────────────┐   │
│  │  userConfigStore │────▶│  formatConfigProvider      │   │
│  │  (Zustand)       │     │  (Singleton)               │   │
│  │  + persistence   │     │                            │   │
│  └──────────────────┘     └────────────────────────────┘   │
│                                    │                         │
│                                    │ subscribe/getConfig     │
│                                    ▼                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Packages (utils, visualizations)           │ │
│  │                                                         │ │
│  │  formatNumber(), formatCurrency(), formatDate()         │ │
│  │  formatValue(), valueFormatter utils                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Composants

1. **FormatConfig (Types)** - `src/core/types/format-config.types.ts`
   - Types et interfaces de configuration
   - Valeurs par défaut
   - Options pour les sélecteurs UI

2. **formatConfigProvider (Singleton)** - `packages/utils/src/formatConfigProvider.ts`
   - Pattern Singleton injectable dans les packages
   - Méthodes `get()`, `set()`, `getConfig()`, `setConfig()`
   - Système de souscription pour les changements

3. **userConfigStore (Zustand)** - `src/application/stores/userConfigStore.ts`
   - Store React avec persistence localStorage
   - Synchronise automatiquement avec `formatConfigProvider`
   - Actions typées pour chaque propriété

4. **Hooks** - `src/application/hooks/common/useFormatConfig.ts`
   - `useFormatConfig()` : Accès et modification de la config
   - `useFormattedValue()` : Fonctions de formatage préconfigurées

## Utilisation

### Dans les composants React

```tsx
import { useFormattedValue } from '@hooks';

function MyComponent({ data }) {
  const { formatNumber, formatCurrency, formatDate } = useFormattedValue();
  
  return (
    <div>
      <p>Montant: {formatCurrency(data.amount)}</p>
      <p>Total: {formatNumber(data.total)}</p>
      <p>Date: {formatDate(data.createdAt)}</p>
    </div>
  );
}
```

### Modifier la configuration

```tsx
import { useFormatConfig } from '@hooks';

function SettingsPage() {
  const { config, setLocale, setCurrency } = useFormatConfig();
  
  return (
    <form>
      <select 
        value={config.locale} 
        onChange={e => setLocale(e.target.value)}
      >
        <option value="fr-FR">Français</option>
        <option value="en-US">English (US)</option>
      </select>
      
      <select 
        value={config.currency} 
        onChange={e => setCurrency(e.target.value)}
      >
        <option value="EUR">Euro (€)</option>
        <option value="USD">Dollar ($)</option>
      </select>
    </form>
  );
}
```

### Dans les packages (sans React)

```typescript
import { formatConfigProvider } from '@customdash/utils';

// Lire la config
const locale = formatConfigProvider.locale;
const currency = formatConfigProvider.currency;

// Ou toute la config
const config = formatConfigProvider.getConfig();

// Les fonctions de formatage utilisent automatiquement la config
import { formatNumber, formatCurrency } from '@customdash/utils';

formatNumber(1234.56);  // Utilise locale de la config
formatCurrency(100);     // Utilise locale et currency de la config
```

## Configuration par défaut

```typescript
const DEFAULT_FORMAT_CONFIG = {
  locale: 'fr-FR',      // Locale française
  currency: 'EUR',      // Euro
  decimals: 2,          // 2 décimales
  dateFormat: 'short',  // Format court
  nullValue: '-',       // Tiret pour null
  includeTime: false,   // Sans l'heure
};
```

## Options disponibles

### Locales

| Code    | Label              |
|---------|-------------------|
| fr-FR   | Français (France) |
| en-US   | English (US)      |
| en-GB   | English (UK)      |
| de-DE   | Deutsch           |
| es-ES   | Español           |
| it-IT   | Italiano          |

### Devises

| Code | Label           | Symbole |
|------|-----------------|---------|
| EUR  | Euro            | €       |
| USD  | US Dollar       | $       |
| GBP  | British Pound   | £       |
| JPY  | Japanese Yen    | ¥       |
| CHF  | Swiss Franc     | CHF     |
| CAD  | Canadian Dollar | C$      |
| AUD  | Australian Dollar | A$    |

### Formats de date

| Format | Exemple (fr-FR)      |
|--------|---------------------|
| short  | 15/01/2026          |
| medium | 15 janv. 2026       |
| long   | 15 janvier 2026     |
| full   | jeudi 15 janvier 2026 |

## Persistence

La configuration est persistée automatiquement dans `localStorage` sous la clé `customdash-user-config`. Elle est restaurée au démarrage de l'application.

```typescript
// Dans App.tsx
import { syncWithProvider } from '@stores/userConfigStore';

// La synchronisation se fait automatiquement au chargement du store
// grâce à onRehydrateStorage du middleware persist
```

## Tests

Pour les tests, vous pouvez configurer le provider avant chaque test :

```typescript
import { formatConfigProvider } from '@customdash/utils';
import { beforeEach, afterEach } from 'vitest';

const originalConfig = formatConfigProvider.getConfig();

beforeEach(() => {
  formatConfigProvider.setConfig({
    locale: 'en-US',
    currency: 'USD',
    // ...
  });
});

afterEach(() => {
  formatConfigProvider.setConfig(originalConfig);
});
```

## Fichiers concernés

### Types
- `src/core/types/format-config.types.ts`
- `src/core/types/index.ts`

### Store & Hooks
- `src/application/stores/userConfigStore.ts`
- `src/application/hooks/common/useFormatConfig.ts`

### Packages
- `packages/utils/src/formatConfigProvider.ts`
- `packages/utils/src/formatters.ts`
- `packages/visualizations/src/utils/valueFormatter.ts`
- `packages/visualizations/src/utils/config.ts`

### Widgets
- `src/core/widgets/factories/WidgetFieldBuilder.ts`
- `src/core/widgets/services/WidgetFormService.ts`

### Initialisation
- `src/App.tsx`
- `src/core/constants/index.ts` (STORAGE_KEYS.USER_CONFIG)
