import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | DoBbie',
  description: 'Neem contact op om uw DoBbie abonnement te activeren.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
