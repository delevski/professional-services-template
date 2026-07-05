import { beforeEach, expect, it, vi } from 'vitest';
import { submitLead } from './leads';

beforeEach(() => localStorage.clear());

it('normalizes lead fields and persists them in demo storage', async () => {
  vi.spyOn(Date, 'now').mockReturnValueOnce(42);
  const result = await submitLead({
    name: '  נועה לוי  ',
    phone: ' 050 123 4567 ',
    workType: '  לוח חשמל ',
    city: ' תל אביב ',
    urgency: ' רגיל ',
    description: '  בדיקה כללית  ',
    storageKey: 'test-demo-leads',
  });

  expect(result).toEqual({ id: '42', storedAt: expect.any(String) });
  expect(JSON.parse(localStorage.getItem('test-demo-leads'))).toEqual([
    expect.objectContaining({ name: 'נועה לוי', phone: '050 123 4567', workType: 'לוח חשמל', city: 'תל אביב', urgency: 'רגיל', description: 'בדיקה כללית' }),
  ]);
});

it('posts normalized JSON when an endpoint is configured', async () => {
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ id: 'remote-1', storedAt: '2026-07-05T10:00:00.000Z' }),
  });

  await expect(submitLead({ name: '  Dana ', phone: ' 123 ', workType: ' Repair ', city: ' Haifa ', urgency: ' Soon ', description: '' }, '/api/leads')).resolves.toEqual({
    id: 'remote-1',
    storedAt: '2026-07-05T10:00:00.000Z',
  });
  expect(fetchMock).toHaveBeenCalledWith('/api/leads', expect.objectContaining({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Dana', phone: '123', workType: 'Repair', city: 'Haifa', urgency: 'Soon', description: '' }),
  }));
});

it('rejects endpoint failures without writing demo storage', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 503 });
  await expect(submitLead({ name: 'Dana', phone: '123', workType: 'Repair', city: 'Haifa', urgency: 'Soon', storageKey: 'test-demo-leads' }, '/api/leads')).rejects.toThrow();
  expect(localStorage.getItem('test-demo-leads')).toBeNull();
});
