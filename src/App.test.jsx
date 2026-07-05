import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import App from './App';
import styles from './styles.css?raw';
import { ACTIVE_PROFILE } from './profiles';

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

it('owns framing copy and visual choices in the active profile', () => {
  expect(ACTIVE_PROFILE.brand.icon).toBeTruthy();
  expect(ACTIVE_PROFILE.brand.placeholderInitials).toBe('OL');
  expect(ACTIVE_PROFILE.sections.services.heading).toBe('שירותים');
  expect(ACTIVE_PROFILE.services.every(service => service.icon)).toBe(true);
  expect(ACTIVE_PROFILE.trust.every(item => item.icon)).toBe(true);
  expect(ACTIVE_PROFILE.ui.modal.closeLabel).toBeTruthy();
});

it('wires reveal classes and avoids external font requests', () => {
  render(<App />);
  expect(document.querySelectorAll('.reveal.is-visible').length).toBeGreaterThan(5);
  expect(styles).not.toMatch(/fonts\.googleapis|@import\s+url/i);
});

it('focuses the modal and restores focus to its trigger when closed', async () => {
  const user = userEvent.setup();
  render(<App />);
  const trigger = screen.getByRole('button', { name: /קבלו הצעת מחיר/ });
  trigger.focus();
  await user.click(trigger);
  const dialog = screen.getByRole('dialog', { name: 'קבלת הצעת מחיר' });
  expect(dialog.open).toBe(true);
  expect(screen.getByRole('button', { name: 'סגירה' })).toHaveFocus();
  await user.click(screen.getByRole('button', { name: 'סגירה' }));
  expect(trigger).toHaveFocus();
});
