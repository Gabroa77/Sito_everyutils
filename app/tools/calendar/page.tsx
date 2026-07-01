import { Metadata } from 'next';
import CalendarClient from './CalendarClient';

export const metadata: Metadata = {
  title: 'Calendario ✦ EveryUtils',
  description: 'Un calendario completo e minimale in stile Notion per gestire i tuoi impegni, visualizzare le settimane ISO e organizzare la tua agenda.',
};

export default function CalendarPage() {
  return <CalendarClient />;
}
