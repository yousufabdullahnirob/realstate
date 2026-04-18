import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Fix: jsdom doesn't always have localStorage fully implemented in all environments
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

