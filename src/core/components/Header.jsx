import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import BrandMark from './BrandMark';
import Button from './Button';

export default function Header({ profile, onQuote, scrolled }) {
  const [open, setOpen] = useState(false); const labels = profile.ui.navigation;
  return <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}><div className="shell header__inner"><BrandMark brand={profile.brand} /><button type="button" className="menu-toggle" aria-label={open ? labels.closeLabel : labels.openLabel} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav id="primary-navigation" aria-label={labels.mainLabel} className={open ? 'is-open' : ''}>{profile.navigation.map(item => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}</nav><Button aria-label={profile.ui.quote.headerLabel} onClick={onQuote} className="header__cta">{profile.hero.primaryAction}</Button></div></header>;
}
