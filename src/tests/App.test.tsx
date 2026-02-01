import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a new QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>,
  );
};

describe('App', () => {
  it('renders homepage with CustomDash logo', () => {
    renderWithProviders(<App />);

    // Logo text is split: "Custom" and "Dash"
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.getByText('Dash')).toBeInTheDocument();
  });

  it('renders login form with email input', () => {
    renderWithProviders(<App />);

    // Check login form elements using role
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
  });
});
