import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Neo ADU Series - Modern Designs',
  description: 'Explore our Neo ADU Series featuring modern designs with dual color schemes and innovative features.',
};

export default function NeoPage() {
  // Redirect to the first Neo model or to a category page
  redirect('/neo/Arcos');
}
