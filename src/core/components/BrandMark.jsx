import { Zap } from 'lucide-react';

export default function BrandMark({ brand }) {
  return <a className="brand" href="#top" aria-label={brand.businessName}><span className="brand__icon"><Zap aria-hidden="true" /></span><span><strong>{brand.name}</strong><small>{brand.descriptor}</small></span></a>;
}
