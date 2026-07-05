import { useCallback, useEffect, useRef } from 'react';
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

function QuoteModal({ profile, dialogRef, onClose }) {
  const closeRef = useRef(null);
  const labels = profile.ui.modal;
  const requestClose = () => onClose();
  return <dialog ref={dialogRef} className="modal-backdrop" aria-labelledby="quote-title" onCancel={event => { event.preventDefault(); requestClose(); }}><div className="modal"><button ref={closeRef} type="button" className="modal__close" onClick={requestClose} aria-label={labels.closeLabel}><X /></button><p className="eyebrow">{labels.eyebrow}</p><h2 id="quote-title">{profile.leadForm.heading}</h2><p>{labels.description}</p><form onSubmit={event => event.preventDefault()}>{Object.entries(profile.leadForm.fields).map(([key, field]) => key === 'description' ? <label key={key}>{field.label}<textarea name={key} /></label> : <label key={key}>{field.label}<input name={key} required={field.required} /></label>)}<Button type="submit">{profile.leadForm.submitLabel}</Button></form></div></dialog>;
}

export default function App() {
  const profile = ACTIVE_PROFILE;
  const dialogRef = useRef(null);
  const quoteTriggerRef = useRef(null);
  const scroll = useScrollUI();
  useEffect(() => {
    document.documentElement.lang = profile.theme.language;
    document.documentElement.dir = profile.theme.direction;
  }, [profile]);
  const onQuote = event => {
    quoteTriggerRef.current = event?.currentTarget || document.activeElement;
    dialogRef.current?.showModal();
    dialogRef.current?.querySelector('.modal__close')?.focus();
  };
  const closeQuote = useCallback(() => {
    dialogRef.current?.close();
    quoteTriggerRef.current?.focus();
  }, []);
  const colors = profile.theme.colors;
  return <div className="site" style={{ '--midnight': colors.midnight, '--navy': colors.navy, '--surface': colors.surface, '--copper': colors.copper, '--amber': colors.amber }}>
    <Header profile={profile} onQuote={onQuote} scrolled={scroll.scrolled} />
    <main><Hero profile={profile} onQuote={onQuote} /><Trust items={profile.trust} copy={profile.sections.trust} /><Services services={profile.services} copy={profile.sections.services} onQuote={onQuote} /><Projects projects={profile.projects} copy={profile.sections.projects} /><Testimonials testimonials={profile.testimonials} copy={profile.sections.testimonials} /><Packages packages={profile.packages} copy={profile.sections.packages} onQuote={onQuote} /><Professional professional={profile.professional} copy={profile.sections.professional} placeholderInitials={profile.brand.placeholderInitials} /><ServiceArea serviceArea={profile.serviceArea} copy={profile.sections.serviceArea} /><Faq items={profile.faq} copy={profile.sections.faq} /><FinalCta profile={profile} copy={profile.sections.finalCta} onQuote={onQuote} /></main>
    <Footer profile={profile} /><FloatingActions contact={profile.contact} labels={profile.ui.floating} progress={scroll.progress} /><QuoteModal profile={profile} dialogRef={dialogRef} onClose={closeQuote} />
  </div>;
}
