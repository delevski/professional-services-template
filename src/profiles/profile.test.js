import { describe, expect, it } from 'vitest';
import { ACTIVE_PROFILE } from './index';

describe('active professional profile', () => {
  it('selects the isolated electrician profile', () => {
    expect(ACTIVE_PROFILE.id).toBe('electrician');
    expect(ACTIVE_PROFILE.brand.name).toBe('אורי לוי');
    expect(JSON.stringify(ACTIVE_PROFILE)).not.toMatch(/pilates|lumina/i);
  });

  it('provides the complete core contract', () => {
    for (const key of ['brand','theme','navigation','hero','trust','services','projects','testimonials','packages','professional','serviceArea','faq','contact','leadForm','seo']) {
      expect(ACTIVE_PROFILE[key]).toBeTruthy();
    }
  });
});
