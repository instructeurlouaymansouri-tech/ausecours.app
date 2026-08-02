import CprLibrary from '@/components/CprLibrary';

export const metadata = { title: 'CPR Learning Center · AUSECOURS' };

export default function CprPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8">
      <div className="mb-6">
        <h2 className="mb-1.5 font-display text-2xl font-bold md:text-3xl">CPR Video Library</h2>
        <p className="text-muted">Placeholder educational content — swap in original Tunisian-produced videos anytime.</p>
      </div>
      <CprLibrary />
    </div>
  );
}
