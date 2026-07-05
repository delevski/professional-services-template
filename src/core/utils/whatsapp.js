export function buildWhatsAppUrl(input, whatsappNumber) {
  const number = String(whatsappNumber ?? '').replace(/\D/g, '');
  const messageParts = input.messageParts ?? [input.workType, input.city, input.urgency, input.description];
  const message = messageParts.filter(Boolean).join('\n');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
