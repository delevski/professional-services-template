import { ACTIVE_PROFILE } from './profiles';

function HeroSection({ profile }) {
  return (
    <section aria-labelledby="hero-title">
      <p>{profile.brand.businessName}</p>
      <h1 id="hero-title">{profile.hero.headline}</h1>
      <p>{profile.hero.description}</p>
    </section>
  );
}

function ContactSection({ profile }) {
  return (
    <section aria-labelledby="contact-title">
      <h2 id="contact-title">{profile.contact.heading}</h2>
      <a href={`tel:${profile.contact.phone}`}>{profile.contact.phoneDisplay}</a>
    </section>
  );
}

export default function App() {
  return (
    <main>
      <HeroSection profile={ACTIVE_PROFILE} />
      <ContactSection profile={ACTIVE_PROFILE} />
    </main>
  );
}
