import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import QuoteModal from './QuoteModal';

const profile = {
  ui: { modal: { eyebrow: 'Start', description: 'Tell us about the job.', closeLabel: 'Close', requiredError: 'This field is required.', failureMessage: 'Could not save. Try again.', successMessage: 'Saved successfully.', manualWhatsappLabel: 'Continue manually' } },
  leadForm: {
    heading: 'Request a quote', submitLabel: 'Send details', submittingLabel: 'Sending…',
    fields: {
      fullName: { label: 'Full name', required: true }, phone: { label: 'Phone', required: true }, workType: { label: 'Work type', placeholder: 'Choose work type', required: true },
      area: { label: 'City', required: true }, urgency: { label: 'Urgency', placeholder: 'Choose urgency', required: true }, description: { label: 'Description', required: false },
    },
    workTypes: ['Repair', 'Install'], urgencyOptions: ['Normal', 'Urgent'], demoStorageKey: 'quote-test-leads',
    whatsappMessage: { intro: 'New request', labels: { name: 'Name', phone: 'Phone', workType: 'Work', city: 'City', urgency: 'Urgency', description: 'Details' } },
  },
  contact: { whatsapp: '972501234567' },
};

afterEach(() => vi.restoreAllMocks());

function Harness({ submitLeadFn = vi.fn().mockResolvedValue({ id: '1', storedAt: 'now' }) }) {
  const [open, setOpen] = useState(false);
  return <><button type="button" onClick={() => setOpen(true)}>Open quote</button><button type="button" onClick={() => setOpen(false)}>Force close</button><QuoteModal open={open} onClose={() => setOpen(false)} profile={profile} submitLeadFn={submitLeadFn} /></>;
}

function deferred() {
  let resolve;
  const promise = new Promise(next => { resolve = next; });
  return { promise, resolve };
}

async function fillRequired(user) {
  await user.type(screen.getByLabelText('Full name'), 'Dana');
  await user.type(screen.getByLabelText('Phone'), '0501234567');
  await user.selectOptions(screen.getByLabelText('Work type'), 'Repair');
  await user.type(screen.getByLabelText('City'), 'Haifa');
  await user.selectOptions(screen.getByLabelText('Urgency'), 'Urgent');
}

it('has an accessible dialog name and reports required fields', async () => {
  const user = userEvent.setup(); render(<Harness />); await user.click(screen.getByRole('button', { name: 'Open quote' }));
  expect(screen.getByRole('dialog', { name: 'Request a quote' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Send details' }));
  expect(screen.getAllByText('This field is required.')).toHaveLength(5);
  expect(screen.getByLabelText('Full name')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByLabelText('Full name')).toHaveAccessibleDescription('This field is required.');
});

it('persists explicitly before opening WhatsApp and offers a manual continuation link', async () => {
  const user = userEvent.setup();
  const persistence = deferred();
  const submitLeadFn = vi.fn(() => persistence.promise);
  const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  render(<Harness submitLeadFn={submitLeadFn} />); await user.click(screen.getByRole('button', { name: 'Open quote' })); await fillRequired(user);
  expect(submitLeadFn).not.toHaveBeenCalled(); expect(openSpy).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Send details' }));
  await waitFor(() => expect(submitLeadFn).toHaveBeenCalledTimes(1));
  expect(openSpy).not.toHaveBeenCalled();
  persistence.resolve({ id: '1', storedAt: 'now' });
  await waitFor(() => expect(openSpy).toHaveBeenCalledTimes(1));
  expect(screen.getByRole('link', { name: 'Continue manually' })).toHaveAttribute('href', expect.stringMatching(/^https:\/\/wa\.me\//));
});

it('ignores persistence completion after the modal closes', async () => {
  const user = userEvent.setup(); const persistence = deferred();
  const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  render(<Harness submitLeadFn={vi.fn(() => persistence.promise)} />); await user.click(screen.getByRole('button', { name: 'Open quote' })); await fillRequired(user);
  await user.click(screen.getByRole('button', { name: 'Send details' }));
  await user.click(screen.getByRole('button', { name: 'Close' }));
  persistence.resolve({ id: '1', storedAt: 'now' });
  await user.click(screen.getByRole('button', { name: 'Open quote' }));
  expect(openSpy).not.toHaveBeenCalled();
  expect(screen.queryByText('Saved successfully.')).not.toBeInTheDocument();
});

it('retains values and does not open WhatsApp when persistence fails', async () => {
  const user = userEvent.setup(); const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  render(<Harness submitLeadFn={vi.fn().mockRejectedValue(new Error('offline'))} />); await user.click(screen.getByRole('button', { name: 'Open quote' })); await fillRequired(user);
  await user.click(screen.getByRole('button', { name: 'Send details' }));
  expect(await screen.findByText('Could not save. Try again.')).toBeVisible();
  expect(screen.getByLabelText('Full name')).toHaveValue('Dana'); expect(openSpy).not.toHaveBeenCalled();
});

it('closes on Escape and restores focus to the opener', async () => {
  const user = userEvent.setup(); render(<Harness />); const opener = screen.getByRole('button', { name: 'Open quote' }); opener.focus(); await user.click(opener);
  expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  fireEvent(screen.getByRole('dialog', { name: 'Request a quote' }), new Event('cancel', { bubbles: false, cancelable: true }));
  await waitFor(() => expect(opener).toHaveFocus());
  expect(screen.queryByRole('dialog', { name: 'Request a quote' })).not.toBeInTheDocument();
});

it('restores focus when the controlled open prop changes externally', async () => {
  const user = userEvent.setup(); render(<Harness />); const opener = screen.getByRole('button', { name: 'Open quote' });
  await user.click(opener); await user.click(screen.getByRole('button', { name: 'Force close' }));
  await waitFor(() => expect(opener).toHaveFocus());
});

it('starts with an empty form and no success state when reopened after success', async () => {
  const user = userEvent.setup(); vi.spyOn(window, 'open').mockImplementation(() => null); render(<Harness />);
  await user.click(screen.getByRole('button', { name: 'Open quote' })); await fillRequired(user); await user.click(screen.getByRole('button', { name: 'Send details' }));
  expect(await screen.findByText('Saved successfully.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Close' })); await user.click(screen.getByRole('button', { name: 'Open quote' }));
  expect(screen.getByLabelText('Full name')).toHaveValue('');
  expect(screen.queryByText('Saved successfully.')).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Continue manually' })).not.toBeInTheDocument();
});
