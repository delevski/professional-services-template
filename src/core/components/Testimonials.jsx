import { useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
export default function Testimonials({ testimonials, copy }) {
  const reveal = useReveal();
  const [selected, setSelected] = useState(0);
  const total = testimonials.length;
  const move = step => total > 1 && setSelected(current => (current + step + total) % total);
  const position = copy.positionTemplate.replace('{current}', total ? selected + 1 : 0).replace('{total}', total);
  const ordered = testimonials.map((_, offset) => (selected + offset) % total);
  return <section ref={reveal.ref} className={`section section--light ${reveal.className}`} aria-labelledby="testimonials-title"><div className="shell"><div className="testimonial-heading"><div><p className="eyebrow">{copy.eyebrow}</p><h2 id="testimonials-title">{copy.heading}</h2></div><div className="testimonial-controls"><button type="button" aria-label={copy.previousLabel} disabled={total < 2} onClick={() => move(-1)}><ArrowRight aria-hidden="true" /></button><span role="status" aria-live="polite" aria-atomic="true">{position}</span><button type="button" aria-label={copy.nextLabel} disabled={total < 2} onClick={() => move(1)}><ArrowLeft aria-hidden="true" /></button></div></div><div className="testimonial-row">{ordered.map((index, offset) => { const item = testimonials[index]; return <blockquote key={item.name} className={offset === 0 ? 'is-selected' : ''} aria-current={offset === 0 ? 'true' : undefined}><Quote aria-hidden="true" /><p>“{item.quote}”</p><footer>{item.name}<small>{copy.sampleLabel}</small></footer></blockquote>; })}</div></div></section>;
}
