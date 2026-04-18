import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';
import { describe, it, expect } from 'vitest';

describe('Frontend Component Rendering', () => {
  it('renders the Navbar with correct brand name', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText(/About Us/i)).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const projectsLink = screen.getByText(/Projects/i);
    expect(projectsLink).toBeInTheDocument();
  });
});
