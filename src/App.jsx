import { useEffect, useState } from 'react';
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
import QuoteModal from './core/components/QuoteModal';
import { useScrollUI } from './core/hooks/useScrollUI';

export default function App() {
  const profile = ACTIVE_PROFILE;
  const [quoteOpen, setQuoteOpen] = useState(false);
  const scroll = useScrollUI();
  useEffect(() => {
    document.documentElement.lang = profile.theme.language;
    document.documentElement.dir = profile.theme.direction;
  }, [profile]);
  const onQuote = event => {
    setQuoteOpen(true);
  };
  const closeQuote = () => setQuoteOpen(false);
  const colors = profile.theme.colors;
  return <div className="site" style={{ '--midnight': colors.midnight, '--navy': colors.navy, '--surface': colors.surface, '--copper': colors.copper, '--amber': colors.amber }}>
    <Header profile={profile} onQuote={onQuote} scrolled={scroll.scrolled} />
    <main><Hero profile={profile} onQuote={onQuote} /><Trust items={profile.trust} copy={profile.sections.trust} /><Services services={profile.services} copy={profile.sections.services} onQuote={onQuote} /><Projects projects={profile.projects} copy={profile.sections.projects} /><Testimonials testimonials={profile.testimonials} copy={profile.sections.testimonials} /><Packages packages={profile.packages} copy={profile.sections.packages} onQuote={onQuote} /><Professional professional={profile.professional} copy={profile.sections.professional} placeholderInitials={profile.brand.placeholderInitials} /><ServiceArea serviceArea={profile.serviceArea} copy={profile.sections.serviceArea} /><Faq items={profile.faq} copy={profile.sections.faq} /><FinalCta profile={profile} copy={profile.sections.finalCta} onQuote={onQuote} /></main>
    <Footer profile={profile} /><FloatingActions contact={profile.contact} labels={profile.ui.floating} progress={scroll.progress} /><QuoteModal open={quoteOpen} profile={profile} onClose={closeQuote} />
  </div>;
}
