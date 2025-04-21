import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Button } from './Button.js';

// 🧪 Basic unit tests for the Button component

describe('Button', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('applies the correct variant class', () => {
    render(<Button variant="destructive">Delete</Button>);

    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-destructive');
  });

  it('applies the correct size class', () => {
    render(<Button size="sm">Small Button</Button>);

    const button = screen.getByRole('button', { name: /small button/i });
    expect(button).toHaveClass('h-9');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );

    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.textContent).toBe('Ref Button');
  });
});

/**
 * 💡 Testing Strategy Notes:
 *
 * 1. Unit Tests (like these):
 *    - Test individual components in isolation
 *    - Focus on props, rendering, and basic interactions
 *    - Fast and reliable for quick feedback
 *
 * 2. Integration Tests (next level):
 *    - Test how components work together
 *    - Example: testing a form submission flow
 *    - Use testing-library/user-event for more realistic interactions
 *
 * 3. E2E Tests (with Playwright or Cypress):
 *    - Test complete user flows in a real browser
 *    - Example: login flow, navigation, form submission
 *    - Slower but provides confidence in the entire application
 *
 * To set up Playwright for E2E testing:
 * 1. yarn add -D @playwright/test
 * 2. npx playwright install
 * 3. Create tests in a 'e2e' directory
 */
