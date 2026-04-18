import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';
import { expect, test, vi } from 'vitest';

// Mock the AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    logout: vi.fn()
  })
}));

// Mock the SearchContext
vi.mock('../context/SearchContext', () => ({
  useSearch: () => ({
    search: '',
    updateSearch: vi.fn()
  })
}));

test('renders brand logo in Navbar', () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
  
  const brandElement = screen.getByAltText(/Mahim Builders Logo/i);
  expect(brandElement).toBeInTheDocument();
});

test('renders navigation links', () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
  
  expect(screen.getByText(/PROJECTS/i)).toBeInTheDocument();
  expect(screen.getByText(/SERVICES/i)).toBeInTheDocument();
  expect(screen.getByText(/ABOUT/i)).toBeInTheDocument();
});
