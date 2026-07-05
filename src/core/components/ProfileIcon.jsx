import { BadgeDollarSign, Bolt, BriefcaseBusiness, Car, CircuitBoard, Clock3, HousePlug, Lightbulb, ScanSearch, ShieldCheck, Sparkles, Wrench, Zap } from 'lucide-react';

const icons = { badgeDollarSign: BadgeDollarSign, bolt: Bolt, briefcase: BriefcaseBusiness, car: Car, circuitBoard: CircuitBoard, clock: Clock3, housePlug: HousePlug, lightbulb: Lightbulb, scanSearch: ScanSearch, shieldCheck: ShieldCheck, sparkles: Sparkles, wrench: Wrench, zap: Zap };

export default function ProfileIcon({ name, ...props }) {
  const Icon = icons[name] || Sparkles;
  return <Icon {...props} />;
}
