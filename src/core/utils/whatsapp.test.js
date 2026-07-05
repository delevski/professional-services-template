import { expect, it } from 'vitest';
import { buildWhatsAppUrl } from './whatsapp';

it('encodes profile-composed work details in a wa.me URL', () => {
  const url = buildWhatsAppUrl({ messageParts: ['לוח חשמל', 'תל אביב', 'דחוף — לבדיקת זמינות', 'קצר & ניצוצות'] }, '+972-50 555-0147');
  expect(url).toBe(`https://wa.me/972505550147?text=${encodeURIComponent('לוח חשמל\nתל אביב\nדחוף — לבדיקת זמינות\nקצר & ניצוצות')}`);
});

it('supports a profile-independent lead record without embedding labels', () => {
  const url = buildWhatsAppUrl({ workType: 'Repair', city: 'Haifa', urgency: 'Soon', description: 'Breaker trips' }, '97250123');
  expect(decodeURIComponent(url.split('text=')[1])).toBe('Repair\nHaifa\nSoon\nBreaker trips');
});
