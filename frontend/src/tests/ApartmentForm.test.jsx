import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ApartmentForm from '../pages/ApartmentForm';
import { expect, test, vi } from 'vitest';

// Mock useNavigate and useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: 'new' })
  };
});

// Mock apiProxy
vi.mock('../utils/proxyClient', () => ({
  default: {
    get: vi.fn(() => Promise.resolve([])),
    post: vi.fn(() => Promise.resolve({}))
  }
}));

test('renders ApartmentForm with basic fields', async () => {
  render(
    <BrowserRouter>
      <ApartmentForm />
    </BrowserRouter>
  );
  
  expect(screen.getByText(/Add New Apartment/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Apartment Title \*/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Price \(BDT\) \*/i)).toBeInTheDocument();
});

test('updates field value on change', async () => {
  render(
    <BrowserRouter>
      <ApartmentForm />
    </BrowserRouter>
  );
  
  const titleInput = screen.getByLabelText(/Apartment Title \*/i);
  fireEvent.change(titleInput, { target: { value: 'New Test Apartment' } });
  expect(titleInput.value).toBe('New Test Apartment');
});
