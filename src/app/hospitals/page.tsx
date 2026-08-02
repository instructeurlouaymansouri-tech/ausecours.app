import { getFacilities } from '@/lib/facilities';
import HospitalMap from '@/components/HospitalMap';

export const metadata = { title: 'Nearby Hospitals · AUSECOURS' };

export default async function HospitalsPage() {
  const facilities = await getFacilities();
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8">
      <div className="mb-6">
        <h2 className="mb-1.5 font-display text-2xl font-bold md:text-3xl">Nearby hospitals & pharmacies</h2>
        <p className="text-muted">Allow location access, or pick your city manually.</p>
      </div>
      <HospitalMap facilities={facilities} />
    </div>
  );
}
