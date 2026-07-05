import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Pages deployment contract', () => {
  it('maps the optional repository lead-endpoint variable into the build', () => {
    const workflow = readFileSync('.github/workflows/pages.yml', 'utf8');

    expect(workflow).toMatch(
      /- name: Build\s+env:\s+VITE_LEAD_ENDPOINT: \$\{\{ vars\.VITE_LEAD_ENDPOINT \}\}\s+run: npm run build/,
    );
  });
});
