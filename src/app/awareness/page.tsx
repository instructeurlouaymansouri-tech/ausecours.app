import AwarenessCards from '@/components/AwarenessCards';

export const metadata = { title: 'Daily Emergency Awareness · AUSECOURS' };

export default function AwarenessPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8">
      <div className="mb-6">
        <h2 className="mb-1.5 font-display text-2xl font-bold md:text-3xl">Daily Emergency Awareness</h2>
        <p className="text-muted">Tips and facts that refresh every day.</p>
      </div>
      <AwarenessCards />
    </div>
  );
}
