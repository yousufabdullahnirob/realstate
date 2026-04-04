import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ApartmentListing from '../pages/ApartmentListing';
import { MemoryRouter } from 'react-router-dom';
import { CompareProvider } from '../context/CompareContext';
import apiProxy from '../utils/proxyClient';
import { DataAdapter } from '../utils/dataAdapter';

// Mock dependencies
vi.mock('../utils/proxyClient');
vi.mock('../utils/dataAdapter', () => ({
  DataAdapter: {
    adaptApartment: (data) => data,
  },
}));
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('ApartmentListing Component', () => {
  const mockApartments = [
    {
      id: 1,
      title: 'Luxury 3BHK',
      price: '৳ 12,000,000',
      size: '1500 sqft',
      bedrooms: 3,
      image: '/test.jpg'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the loading state initially', () => {
    apiProxy.get.mockReturnValue(new Promise(() => {})); // Never resolves
    render(
      <MemoryRouter>
        <CompareProvider>
          <ApartmentListing />
        </CompareProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading apartments.../i)).toBeInTheDocument();
  });

  it('renders apartments after successful fetch', async () => {
    apiProxy.get.mockResolvedValue(mockApartments);
    
    render(
      <MemoryRouter>
        <CompareProvider>
          <ApartmentListing />
        </CompareProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Luxury 3BHK')).toBeInTheDocument();
    });
    
    expect(screen.getByText('1500 sqft')).toBeInTheDocument();
  });

  it('renders "no apartments found" when list is empty', async () => {
    apiProxy.get.mockResolvedValue([]);
    
    render(
      <MemoryRouter>
        <CompareProvider>
          <ApartmentListing />
        </CompareProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No apartments found matching these criteria/i)).toBeInTheDocument();
    });
  });
});
