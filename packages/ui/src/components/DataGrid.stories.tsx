import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { DataGrid } from './DataGrid';
import type { DataGridColumnDef, DataGridRow } from './DataGrid';

const meta: Meta<typeof DataGrid> = {
  title: 'UI/DataGrid',
  component: DataGrid,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <div style={{ width: '900px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataGrid>;

// ---------------------------------------------------------------------------
// Story 1 - Simple flat columns (users list)
// ---------------------------------------------------------------------------

const userColumns: DataGridColumnDef[] = [
  { key: 'id', label: '#', type: 'number', width: '60px' },
  { key: 'name', label: 'Nom' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Rôle' },
  { key: 'department', label: 'Département' },
  { key: 'hireDate', label: 'Embauche', type: 'date' },
  { key: 'salary', label: 'Salaire', type: 'currency' },
];

const userData: DataGridRow[] = [
  {
    id: 1,
    name: 'Alice Martin',
    email: 'alice@customdash.io',
    role: 'Admin',
    department: 'IT',
    hireDate: '2021-03-15',
    salary: 58000,
  },
  {
    id: 2,
    name: 'Bob Johnson',
    email: 'bob@customdash.io',
    role: 'Analyste',
    department: 'Data',
    hireDate: '2020-07-01',
    salary: 52000,
  },
  {
    id: 3,
    name: 'Carol Williams',
    email: 'carol@customdash.io',
    role: 'Designer',
    department: 'Produit',
    hireDate: '2022-01-10',
    salary: 49000,
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david@customdash.io',
    role: 'Dev',
    department: 'IT',
    hireDate: '2019-11-20',
    salary: 61000,
  },
  {
    id: 5,
    name: 'Emma Davis',
    email: 'emma@customdash.io',
    role: 'Admin',
    department: 'RH',
    hireDate: '2023-04-05',
    salary: 55000,
  },
  {
    id: 6,
    name: 'François Petit',
    email: 'francois@customdash.io',
    role: 'Dev',
    department: 'IT',
    hireDate: '2021-09-12',
    salary: 63000,
  },
  {
    id: 7,
    name: 'Gabrielle Leroy',
    email: 'gabrielle@customdash.io',
    role: 'Analyste',
    department: 'Finance',
    hireDate: '2020-02-28',
    salary: 54000,
  },
  {
    id: 8,
    name: 'Hugo Bernard',
    email: 'hugo@customdash.io',
    role: 'Dev',
    department: 'IT',
    hireDate: '2022-06-01',
    salary: 59000,
  },
];

export const SimpleColumns: Story = {
  name: 'Colonnes simples',
  args: {
    columns: userColumns,
    data: userData,
    pageSize: 5,
    caption: 'Liste des utilisateurs',
  },
};

// ---------------------------------------------------------------------------
// Story 2 - Grouped columns (Bookings by Building × Month)
// ---------------------------------------------------------------------------

const bookingColumns: DataGridColumnDef[] = [
  { key: 'building', label: 'Bâtiment', width: '110px' },
  { key: 'capacity', label: 'Capacité', type: 'number', width: '90px' },
  {
    label: 'T1 2024',
    children: [
      { key: 'jan', label: 'Jan', type: 'number', minWidth: '70px' },
      { key: 'feb', label: 'Fév', type: 'number', minWidth: '70px' },
      { key: 'mar', label: 'Mar', type: 'number', minWidth: '70px' },
    ],
  },
  {
    label: 'T2 2024',
    children: [
      { key: 'apr', label: 'Avr', type: 'number', minWidth: '70px' },
      { key: 'may', label: 'Mai', type: 'number', minWidth: '70px' },
      { key: 'jun', label: 'Jun', type: 'number', minWidth: '70px' },
    ],
  },
  { key: 'total', label: 'Total H1', type: 'number', width: '100px' },
];

const bookingData: DataGridRow[] = [
  {
    building: 'Bâtiment A',
    capacity: 120,
    jan: 3200,
    feb: 2900,
    mar: 3450,
    apr: 3800,
    may: 4100,
    jun: 3950,
    total: 21400,
  },
  {
    building: 'Bâtiment B',
    capacity: 85,
    jan: 2800,
    feb: 2600,
    mar: 3100,
    apr: 3400,
    may: 3622,
    jun: 3200,
    total: 18722,
  },
  {
    building: 'Bâtiment C',
    capacity: 60,
    jan: 1900,
    feb: 1750,
    mar: 2050,
    apr: 2300,
    may: 2500,
    jun: 2400,
    total: 12900,
  },
  {
    building: 'Bâtiment D',
    capacity: 200,
    jan: 5100,
    feb: 4800,
    mar: 5600,
    apr: 6200,
    may: 6800,
    jun: 6500,
    total: 35000,
  },
  {
    building: 'Bâtiment E',
    capacity: 45,
    jan: 1200,
    feb: 1100,
    mar: 1350,
    apr: 1500,
    may: 1650,
    jun: 1580,
    total: 8380,
  },
];

export const GroupedColumns: Story = {
  name: 'Colonnes groupées - Réservations par bâtiment',
  args: {
    columns: bookingColumns,
    data: bookingData,
    caption: 'Réservations H1 2024 - vue par trimestre',
  },
};

// ---------------------------------------------------------------------------
// Story 3 - Widget chart drill-down (Series × Category)
// ---------------------------------------------------------------------------

const seriesColumns: DataGridColumnDef[] = [
  { key: 'category', label: 'Catégorie' },
  {
    label: 'Réservations',
    children: [
      { key: 'bookings_2023', label: '2023', type: 'number' },
      { key: 'bookings_2024', label: '2024', type: 'number' },
      { key: 'bookings_delta', label: 'Δ %', type: 'number', align: 'right' },
    ],
  },
  {
    label: 'Revenus (€)',
    children: [
      { key: 'revenue_2023', label: '2023', type: 'currency' },
      { key: 'revenue_2024', label: '2024', type: 'currency' },
    ],
  },
  { key: 'occupancy', label: 'Taux occ.', type: 'number', align: 'right', width: '100px' },
];

const seriesData: DataGridRow[] = [
  {
    category: 'Bâtiment A',
    bookings_2023: 19800,
    bookings_2024: 21400,
    bookings_delta: 8.1,
    revenue_2023: 395000,
    revenue_2024: 428000,
    occupancy: 89,
  },
  {
    category: 'Bâtiment B',
    bookings_2023: 17200,
    bookings_2024: 18722,
    bookings_delta: 8.8,
    revenue_2023: 344000,
    revenue_2024: 374440,
    occupancy: 73,
  },
  {
    category: 'Bâtiment C',
    bookings_2023: 11500,
    bookings_2024: 12900,
    bookings_delta: 12.2,
    revenue_2023: 230000,
    revenue_2024: 258000,
    occupancy: 60,
  },
  {
    category: 'Bâtiment D',
    bookings_2023: 32000,
    bookings_2024: 35000,
    bookings_delta: 9.4,
    revenue_2023: 640000,
    revenue_2024: 700000,
    occupancy: 92,
  },
  {
    category: 'Bâtiment E',
    bookings_2023: 7800,
    bookings_2024: 8380,
    bookings_delta: 7.4,
    revenue_2023: 156000,
    revenue_2024: 167600,
    occupancy: 52,
  },
];

export const WidgetDrillDown: Story = {
  name: 'Drill-down widget - Réservations par bâtiment (détail)',
  args: {
    columns: seriesColumns,
    data: seriesData,
    caption: 'Données détaillées - clic sur le graphique "Bookings by Building"',
  },
};

// ---------------------------------------------------------------------------
// Story 4 - Custom cell render with Badge
// ---------------------------------------------------------------------------

const statusColumns: DataGridColumnDef[] = [
  { key: 'id', label: '#', type: 'number', width: '60px', sortable: false },
  { key: 'name', label: 'Widget' },
  { key: 'type', label: 'Type' },
  { key: 'datasource', label: 'Source de données' },
  { key: 'records', label: 'Lignes', type: 'number' },
  {
    key: 'status',
    label: 'Statut',
    align: 'center',
    render: value => {
      const map: Record<string, { variant: 'success' | 'danger' | 'warning'; label: string }> = {
        active: { variant: 'success', label: 'Actif' },
        error: { variant: 'danger', label: 'Erreur' },
        pending: { variant: 'warning', label: 'En attente' },
      };
      const config = map[String(value)] ?? { variant: 'warning' as const, label: String(value) };
      return (
        <Badge variant={config.variant} size="sm">
          {config.label}
        </Badge>
      );
    },
  },
  { key: 'lastRefresh', label: 'Dernier refresh', type: 'date' },
];

const statusData: DataGridRow[] = [
  {
    id: 1,
    name: 'KPI Revenus',
    type: 'KPI',
    datasource: 'PostgreSQL',
    records: 14250,
    status: 'active',
    lastRefresh: '2024-06-15',
  },
  {
    id: 2,
    name: 'Bar - Ventes',
    type: 'BarChart',
    datasource: 'Elasticsearch',
    records: 8400,
    status: 'active',
    lastRefresh: '2024-06-15',
  },
  {
    id: 3,
    name: 'Pie - Catégories',
    type: 'PieChart',
    datasource: 'CSV Upload',
    records: 320,
    status: 'pending',
    lastRefresh: '2024-06-14',
  },
  {
    id: 4,
    name: 'Tableau Clients',
    type: 'Table',
    datasource: 'REST API',
    records: 0,
    status: 'error',
    lastRefresh: '2024-06-13',
  },
  {
    id: 5,
    name: 'Line - Tendance',
    type: 'LineChart',
    datasource: 'JSON Upload',
    records: 5200,
    status: 'active',
    lastRefresh: '2024-06-15',
  },
  {
    id: 6,
    name: 'Radar Perf.',
    type: 'RadarChart',
    datasource: 'Elasticsearch',
    records: 1800,
    status: 'active',
    lastRefresh: '2024-06-15',
  },
];

export const CustomCellRender: Story = {
  name: 'Rendu personnalisé - Badge de statut',
  args: {
    columns: statusColumns,
    data: statusData,
  },
};

// ---------------------------------------------------------------------------
// Story 5 - Large dataset (pagination)
// ---------------------------------------------------------------------------

function generateRows(count: number): DataGridRow[] {
  const buildings = ['A', 'B', 'C', 'D', 'E', 'F'];
  const types = ['Conférence', 'Bureau', 'Coworking', 'Salle de réunion'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    date: new Date(2024, Math.floor(i / 30), (i % 28) + 1).toISOString().slice(0, 10),
    building: `Bâtiment ${buildings[i % buildings.length]}`,
    room: `Salle ${(i % 20) + 1}`,
    type: types[i % types.length],
    duration: Math.floor(Math.random() * 3 + 1),
    attendees: Math.floor(Math.random() * 20 + 2),
    revenue: Math.floor(Math.random() * 500 + 50),
  }));
}

const largeDataColumns: DataGridColumnDef[] = [
  { key: 'id', label: '#', type: 'number', width: '60px' },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'building', label: 'Bâtiment' },
  { key: 'room', label: 'Salle' },
  { key: 'type', label: 'Type' },
  { key: 'duration', label: 'Durée (h)', type: 'number' },
  { key: 'attendees', label: 'Participants', type: 'number' },
  { key: 'revenue', label: 'Revenu', type: 'currency' },
];

export const LargeDataset: Story = {
  name: 'Grand jeu de données - pagination',
  args: {
    columns: largeDataColumns,
    data: generateRows(120),
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    caption: '120 réservations - testez la recherche, le tri et la pagination',
  },
};

// ---------------------------------------------------------------------------
// Story 6 - Loading state
// ---------------------------------------------------------------------------

export const LoadingState: Story = {
  name: 'État chargement',
  args: {
    columns: userColumns,
    data: [],
    loading: true,
  },
};

// ---------------------------------------------------------------------------
// Story 7 - Empty state
// ---------------------------------------------------------------------------

export const EmptyState: Story = {
  name: 'État vide',
  args: {
    columns: userColumns,
    data: [],
    emptyMessage: 'Aucune donnée trouvée pour les filtres sélectionnés.',
  },
};

// ---------------------------------------------------------------------------
// Story 8 - Compact mode
// ---------------------------------------------------------------------------

export const CompactMode: Story = {
  name: 'Mode compact',
  args: {
    columns: bookingColumns,
    data: bookingData,
    compact: true,
    striped: true,
    caption: 'Mode compact - adapté aux dashboards denses',
  },
};

// ---------------------------------------------------------------------------
// Story 9 - No search / no pagination
// ---------------------------------------------------------------------------

export const Minimal: Story = {
  name: 'Minimal - sans toolbar',
  args: {
    columns: [
      { key: 'category', label: 'Catégorie' },
      { key: 'value', label: 'Valeur', type: 'number' },
      { key: 'pct', label: '% du total', type: 'number', align: 'right' },
    ],
    data: [
      { category: 'Bâtiment A', value: 21400, pct: 31.2 },
      { category: 'Bâtiment B', value: 18722, pct: 27.3 },
      { category: 'Bâtiment C', value: 12900, pct: 18.8 },
      { category: 'Bâtiment D', value: 35000, pct: 51.0 },
      { category: 'Bâtiment E', value: 8380, pct: 12.2 },
    ],
    searchable: false,
    pageSizeOptions: [5],
    pageSize: 5,
    caption: 'Récapitulatif par bâtiment',
  },
};
