const LEAD_FIELDS = ['name', 'phone', 'workType', 'city', 'urgency', 'description'];

function normalizeLead(input) {
  return Object.fromEntries(LEAD_FIELDS.map(field => [field, String(input[field] ?? '').trim()]));
}

export async function submitLead(input, endpoint = import.meta.env.VITE_LEAD_ENDPOINT) {
  const lead = normalizeLead(input);

  if (endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!response.ok) throw new Error(`Lead submission failed (${response.status})`);
    const result = await response.json();
    return { id: result.id, storedAt: result.storedAt };
  }

  const id = String(Date.now());
  const storedAt = new Date().toISOString();
  const storageKey = input.storageKey;
  if (!storageKey) throw new Error('A demo storage key is required');
  const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
  localStorage.setItem(storageKey, JSON.stringify([...existing, { ...lead, id, storedAt }]));
  return { id, storedAt };
}
