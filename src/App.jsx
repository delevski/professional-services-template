import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ACTIVE_PROFILE } from './profiles';
import Header from './core/components/Header';
import Hero from './core/components/Hero';
import Trust from './core/components/Trust';
import Services from './core/components/Services';
import Projects from './core/components/Projects';
import Testimonials from './core/components/Testimonials';
import Packages from './core/components/Packages';
import Professional from './core/components/Professional';
import ServiceArea from './core/components/ServiceArea';
import Faq from './core/components/Faq';
import FinalCta from './core/components/FinalCta';
import Footer from './core/components/Footer';
import FloatingActions from './core/components/FloatingActions';
import Button from './core/components/Button';
import { useScrollUI } from './core/hooks/useScrollUI';

function QuoteModal({ profile, open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = event => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return <dialog className="modal-backdrop" open aria-labelledby="quote-title"><div className="modal"><button type="button" className="modal__close" onClick={onClose} aria-label="סגירה"><X /></button><p className="eyebrow">פרטים ראשוניים</p><h2 id="quote-title">{profile.leadForm.heading}</h2><p>השאירו פרטים ונחזור אליכם לתיאום. זהו טופס הדגמה.</p><form onSubmit={event => event.preventDefault()}>{Object.entries(profile.leadForm.fields).map(([key, field]) => key === 'description' ? <label key={key}>{field.label}<textarea name={key} /></label> : <label key={key}>{field.label}<input name={key} required={field.required} /></label>)}<Button type="submit">{profile.leadForm.submitLabel}</Button></form></div></dialog>;
}

export default function App() {
  const profile = ACTIVE_PROFILE;
  const [quoteOpen, setQuoteOpen] = useState(false);
  const scroll = useScrollUI();
  useEffect(() => {
    document.documentElement.lang = profile.theme.language;
    document.documentElement.dir = profile.theme.direction;
  }, [profile]);
  const onQuote = () => setQuoteOpen(true);
  const colors = profile.theme.colors;
  return <div className="site" style={{ '--midnight': colors.midnight, '--navy': colors.navy, '--surface': colors.surface, '--copper': colors.copper, '--amber': colors.amber }}>
    <Header profile={profile} onQuote={onQuote} scrolled={scroll.scrolled} />
    <main><Hero profile={profile} onQuote={onQuote} /><Trust items={profile.trust} /><Services services={profile.services} onQuote={onQuote} /><Projects projects={profile.projects} /><Testimonials testimonials={profile.testimonials} /><Packages packages={profile.packages} onQuote={onQuote} /><Professional professional={profile.professional} /><ServiceArea serviceArea={profile.serviceArea} /><Faq items={profile.faq} /><FinalCta profile={profile} onQuote={onQuote} /></main>
    <Footer profile={profile} /><FloatingActions contact={profile.contact} progress={scroll.progress} /><QuoteModal profile={profile} open={quoteOpen} onClose={() => setQuoteOpen(false)} />
  </div>;
}
