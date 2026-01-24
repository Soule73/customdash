import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Table } from './Table';

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    Story => (
      <div style={{ width: '800px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

const sampleData = [
  { id: 1, name: 'Alice Martin', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'Editor', status: 'Inactive' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'User', status: 'Active' },
  { id: 5, name: 'Emma Davis', email: 'emma@example.com', role: 'Admin', status: 'Active' },
];

export const Default: Story = {
  render: () => (
    <Table>
      <Table.Header>
        <tr>
          <Table.Head>Name</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head>Role</Table.Head>
          <Table.Head>Status</Table.Head>
        </tr>
      </Table.Header>
      <Table.Body>
        {sampleData.map((row, index) => (
          <Table.Row key={row.id} index={index}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.email}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
            <Table.Cell>{row.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

export const WithSorting: Story = {
  render: function SortableTable() {
    const [sortKey, setSortKey] = useState<string | null>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const sortedData = [...sampleData].sort((a, b) => {
      if (!sortKey) return 0;
      const aVal = a[sortKey as keyof typeof a];
      const bVal = b[sortKey as keyof typeof b];
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return (
      <Table
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={(key, direction) => {
          setSortKey(key);
          setSortDirection(direction);
        }}
      >
        <Table.Header sticky>
          <tr>
            <Table.Head sortable sortKey="name">
              Name
            </Table.Head>
            <Table.Head sortable sortKey="email">
              Email
            </Table.Head>
            <Table.Head sortable sortKey="role">
              Role
            </Table.Head>
            <Table.Head sortable sortKey="status">
              Status
            </Table.Head>
          </tr>
        </Table.Header>
        <Table.Body>
          {sortedData.map((row, index) => (
            <Table.Row key={row.id} index={index}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.email}</Table.Cell>
              <Table.Cell>{row.role}</Table.Cell>
              <Table.Cell>{row.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  },
};

export const Compact: Story = {
  render: () => (
    <Table compact>
      <Table.Header>
        <tr>
          <Table.Head>Name</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head>Role</Table.Head>
        </tr>
      </Table.Header>
      <Table.Body>
        {sampleData.map((row, index) => (
          <Table.Row key={row.id} index={index}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.email}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

export const WithoutStripes: Story = {
  render: () => (
    <Table striped={false}>
      <Table.Header>
        <tr>
          <Table.Head>Name</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head>Role</Table.Head>
        </tr>
      </Table.Header>
      <Table.Body>
        {sampleData.map((row, index) => (
          <Table.Row key={row.id} index={index}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.email}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

export const WithAlignment: Story = {
  render: () => (
    <Table>
      <Table.Header>
        <tr>
          <Table.Head align="left">Product</Table.Head>
          <Table.Head align="center">Quantity</Table.Head>
          <Table.Head align="right">Price</Table.Head>
        </tr>
      </Table.Header>
      <Table.Body>
        <Table.Row index={0}>
          <Table.Cell align="left">Widget A</Table.Cell>
          <Table.Cell align="center">25</Table.Cell>
          <Table.Cell align="right">1 250 EUR</Table.Cell>
        </Table.Row>
        <Table.Row index={1}>
          <Table.Cell align="left">Widget B</Table.Cell>
          <Table.Cell align="center">42</Table.Cell>
          <Table.Cell align="right">2 100 EUR</Table.Cell>
        </Table.Row>
        <Table.Row index={2}>
          <Table.Cell align="left">Widget C</Table.Cell>
          <Table.Cell align="center">18</Table.Cell>
          <Table.Cell align="right">540 EUR</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const WithSearch: Story = {
  render: function SearchableTable() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = sampleData.filter(
      row =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
      <div className="space-y-4">
        <div className="w-64">
          <Table.Search value={searchTerm} onChange={setSearchTerm} />
        </div>
        <Table>
          <Table.Header>
            <tr>
              <Table.Head>Name</Table.Head>
              <Table.Head>Email</Table.Head>
              <Table.Head>Role</Table.Head>
            </tr>
          </Table.Header>
          <Table.Body>
            {filteredData.map((row, index) => (
              <Table.Row key={row.id} index={index}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.email}</Table.Cell>
                <Table.Cell>{row.role}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  },
};

export const WithPagination: Story = {
  render: function PaginatedTable() {
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 2;

    const totalPages = Math.ceil(sampleData.length / pageSize);
    const paginatedData = sampleData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <Table.Header>
            <tr>
              <Table.Head>Name</Table.Head>
              <Table.Head>Email</Table.Head>
              <Table.Head>Role</Table.Head>
            </tr>
          </Table.Header>
          <Table.Body>
            {paginatedData.map((row, index) => (
              <Table.Row key={row.id} index={index}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.email}</Table.Cell>
                <Table.Cell>{row.role}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Table.Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRows={sampleData.length}
          pageSize={pageSize}
          onFirst={() => setCurrentPage(0)}
          onPrev={() => setCurrentPage(p => Math.max(0, p - 1))}
          onNext={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
          onLast={() => setCurrentPage(totalPages - 1)}
        />
      </div>
    );
  },
};

export const EmptyState: Story = {
  render: () => <Table.Empty />,
};

export const EmptyStateCustom: Story = {
  render: () => <Table.Empty title="No users" description="Add your first user to get started" />,
};

export const StickyHeader: Story = {
  render: () => {
    const longData = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Utilisateur ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: ['Admin', 'User', 'Editor'][i % 3],
    }));

    return (
      <div className="h-64 overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <Table>
          <Table.Header sticky>
            <tr>
              <Table.Head>Name</Table.Head>
              <Table.Head>Email</Table.Head>
              <Table.Head>Role</Table.Head>
            </tr>
          </Table.Header>
          <Table.Body>
            {longData.map((row, index) => (
              <Table.Row key={row.id} index={index}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.email}</Table.Cell>
                <Table.Cell>{row.role}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  },
};
