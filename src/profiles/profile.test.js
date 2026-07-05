import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createElement } from 'react';
import App from '../App';
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

  it('labels every business claim as fictional sample content', () => {
    expect(ACTIVE_PROFILE.brand.sampleDisclosure).toMatch(/כל התוכן העסקי/);
    expect(ACTIVE_PROFILE.brand.sampleDisclosure).toMatch(/פרויקטים ותוצאות/);
    expect(ACTIVE_PROFILE.brand.sampleDisclosure).toMatch(/ניסיון.*נתונים כמותיים/);
  });

  it('renders the profile disclosure visibly', () => {
    render(createElement(App));

    expect(screen.getByRole('note')).toHaveTextContent(ACTIVE_PROFILE.brand.sampleDisclosure);
  });
});
