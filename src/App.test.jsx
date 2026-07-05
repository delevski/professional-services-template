import { render, screen, within } from '@testing-library/react';
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

it('navigates testimonials with profile-labelled controls and announces position', async () => {
  const user = userEvent.setup();
  render(<App />);
  const next = screen.getByRole('button', { name: ACTIVE_PROFILE.sections.testimonials.nextLabel });
  const previous = screen.getByRole('button', { name: ACTIVE_PROFILE.sections.testimonials.previousLabel });
  expect(screen.getByRole('status')).toHaveTextContent('1 מתוך 5');
  await user.click(next);
  expect(screen.getByRole('status')).toHaveTextContent('2 מתוך 5');
  await user.click(previous);
  expect(screen.getByRole('status')).toHaveTextContent('1 מתוך 5');
  await user.click(previous);
  expect(screen.getByRole('status')).toHaveTextContent('5 מתוך 5');
});

it('renders the profile testimonial portrait URL as a lazy decorative image', () => {
  render(<App />);
  const portrait = document.querySelector('.testimonial-row blockquote img');
  expect(portrait).toHaveAttribute('src', ACTIVE_PROFILE.testimonials[0].image);
  expect(portrait).toHaveAttribute('loading', 'lazy');
  expect(portrait).toHaveAttribute('width', '72');
  expect(portrait).toHaveAttribute('height', '72');
  expect(portrait).toHaveAttribute('alt', '');
});

it('renders the profile hero video muted, looping, inline, and poster-backed', () => {
  render(<App />);
  const video = document.querySelector('.hero__media video');
  expect(video).toHaveAttribute('src', ACTIVE_PROFILE.hero.video);
  expect(video).toHaveAttribute('poster', ACTIVE_PROFILE.hero.image);
  expect(video).toHaveAttribute('autoplay');
  expect(video).toHaveProperty('muted', true);
  expect(video).toHaveAttribute('loop');
  expect(video).toHaveAttribute('playsinline');
  expect(video).toHaveAttribute('preload', 'metadata');
  expect(video).toHaveAttribute('aria-label', ACTIVE_PROFILE.hero.videoLabel);
  expect(video).toHaveAttribute('tabindex', '-1');
  expect(video).not.toHaveAttribute('aria-hidden');
  expect(video).not.toHaveAttribute('role');
});

it('supports an accessible mobile navigation interaction', async () => {
  const user = userEvent.setup(); render(<App />);
  const toggle = screen.getByRole('button', { name: ACTIVE_PROFILE.ui.navigation.openLabel });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await user.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const nav = screen.getByRole('navigation', { name: ACTIVE_PROFILE.ui.navigation.mainLabel });
  expect(nav).toHaveAttribute('id', expect.any(String));
  expect(toggle).toHaveAttribute('aria-controls', nav.id);
  const link = within(nav).getByRole('link', { name: 'שירותים' });
  expect(link).toBeVisible(); await user.click(link);
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

it('renders prominent demo disclosure, privacy access, project coverage, and profile input metadata', async () => {
  const user = userEvent.setup(); render(<App />);
  expect(screen.getByText('אתר הדגמה / עסק בדיוני')).toBeVisible();
  expect(screen.getByRole('link', { name: ACTIVE_PROFILE.privacy.label })).toHaveAttribute('href', ACTIVE_PROFILE.privacy.href);
  expect(new Set(ACTIVE_PROFILE.projects.map(project => project.category))).toEqual(new Set(['residential', 'retail', 'office', 'lighting', 'ev', 'smart-home']));
  expect(ACTIVE_PROFILE.projects.every(project => project.sample && project.service && project.challenge && project.result)).toBe(true);
  expect(screen.getAllByText(new RegExp(ACTIVE_PROFILE.sections.projects.sampleLabel))).toHaveLength(6);
  await user.click(screen.getAllByRole('button', { name: /קבלו הצעת מחיר/ })[0]);
  expect(screen.getByLabelText('שם מלא')).toHaveAttribute('autocomplete', 'name');
  expect(screen.getByLabelText('טלפון')).toHaveAttribute('type', 'tel');
  expect(screen.getByLabelText('טלפון')).toHaveAttribute('inputmode', 'tel');
  expect(screen.getByLabelText('טלפון')).toHaveAttribute('autocomplete', 'tel');
});
