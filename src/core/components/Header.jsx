import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import BrandMark from './BrandMark';
import Button from './Button';

export default function Header({ profile, onQuote, scrolled }) {
  const [open, setOpen] = useState(false);
  return <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}><div className="shell header__inner"><BrandMark brand={profile.brand} /><button className="menu-toggle" aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav aria-label="ניווט ראשי" className={open ? 'is-open' : ''}>{profile.navigation.map(item => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}</nav><Button aria-label="פתיחת טופס הצעה" onClick={onQuote} className="header__cta">{profile.hero.primaryAction}</Button></div></header>;
}
