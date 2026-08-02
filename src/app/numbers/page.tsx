import EmergencyNumbers from '@/components/EmergencyNumbers';

export const metadata = { title: 'Emergency Numbers · AUSECOURS' };

export default function NumbersPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8">
      <div className="mb-6">
        <h2 className="mb-1.5 font-display text-2xl font-bold md:text-3xl">Emergency Numbers — Tunisia</h2>
        <p className="text-muted">Tap a number to call directly on supported devices.</p>
      </div>
      <EmergencyNumbers />
    </div>
  );
}
