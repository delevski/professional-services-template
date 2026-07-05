import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import App from './App';

it('renders the Hebrew electrician conversion page without Pilates copy', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /חשמל בטוח/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /קבלו הצעת מחיר/ })).toBeInTheDocument();
  expect(document.documentElement.dir).toBe('rtl');
  expect(document.body.textContent).not.toMatch(/pilates|lumina/i);
});

it('renders profile sections and opens FAQ answers accessibly', async () => {
  const user = userEvent.setup();
  render(<App />);
  expect(screen.getByRole('heading', { name: 'שירותים' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'פרויקטים נבחרים' })).toBeInTheDocument();
  const question = screen.getByRole('button', { name: 'איך נקבע המחיר?' });
  expect(question).toHaveAttribute('aria-expanded', 'false');
  await user.click(question);
  expect(question).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText(/מחיר סופי נקבע לאחר אבחון/)).toBeVisible();
});

it('opens the quote flow from conversion components', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getAllByRole('button', { name: /קבלו הצעת מחיר/ })[0]);
  expect(screen.getByRole('dialog', { name: 'קבלת הצעת מחיר' })).toBeInTheDocument();
});
