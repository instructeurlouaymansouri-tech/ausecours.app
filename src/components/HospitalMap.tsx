'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Facility, haversineKm, TUNISIAN_CITIES } from '@/lib/facilityTypes';
import { useI18n } from '@/lib/i18n';

// react-leaflet touches `window`, so it must be loaded client-side only.
const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), { ssr: false });

const TYPE_LABEL: Record<string, Record<string, string>> = {
  hospital: { tn: 'مستشفى', ar: 'مستشفى', fr: 'Hôpital', en: 'Hospital' },
  clinic: { tn: 'عيادة', ar: 'عيادة', fr: 'Clinique', en: 'Clinic' },
  pharmacy: { tn: 'صيدلية', ar: 'صيدلية', fr: 'Pharmacie', en: 'Pharmacy' },
  civil_protection: { tn: 'حماية مدنية', ar: 'حماية مدنية', fr: 'Protection civile', en: 'Civil Protection' },
  ambulance: { tn: 'إسعاف', ar: 'إسعاف', fr: 'Ambulance', en: 'Ambulance' },
};

export default function HospitalMap({ facilities }: { facilities: Facility[] }) {
  const { lang } = useI18n();
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [city, setCity] = useState('Tunis');
  const [leafletIcon, setLeafletIcon] = useState<any>(null);

  // Leaflet's default marker icon needs its image paths patched for bundlers.
  useEffect(() => {
    import('leaflet').then((L) => {
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setLeafletIcon(icon);
    });
  }, []);

  const list = useMemo(() => {
    let l = facilities.map((f) => ({ ...f, dist: undefined as number | undefined }));
    if (userCoords) {
      l = l.map((f) => ({ ...f, dist: haversineKm(userCoords.lat, userCoords.lng, f.lat, f.lng) }));
      l.sort((a, b) => (a.dist ?? 0) - (b.dist ?? 0));
    } else {
      l = l.filter((f) => f.city === city);
    }
    return l;
  }, [facilities, userCoords, city]);

  const center: [number, number] = userCoords
    ? [userCoords.lat, userCoords.lng]
    : list[0]
    ? [list[0].lat, list[0].lng]
    : [36.8065, 10.1815];

  function requestLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert('Location permission denied. Pick a city instead.')
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button onClick={requestLocation} className="rounded-xl bg-gradient-to-br from-accent to-secondary px-5 py-3 text-sm font-bold shadow-glow">
          {lang === 'fr' ? 'Utiliser ma position' : lang === 'en' ? 'Use my location' : 'استعمل موقعي'}
        </button>
        <span className="text-muted text-sm">{lang === 'fr' ? 'ou' : lang === 'en' ? 'or' : 'ولا'}</span>
        <select
          value={city}
          onChange={(e) => {
            setUserCoords(null);
            setCity(e.target.value);
          }}
          className="rounded-xl border border-white/10 bg-card px-3.5 py-2.5 text-sm"
        >
          {TUNISIAN_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5 h-[360px] overflow-hidden rounded-2xl border border-white/10">
        <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
          <TileLayer
            url={process.env.NEXT_PUBLIC_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {leafletIcon &&
            list.map((f) => (
              <Marker key={f.id} position={[f.lat, f.lng]} icon={leafletIcon}>
                <Popup>
                  <b>{f.name}</b>
                  <br />
                  {TYPE_LABEL[f.type][lang]}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      <div className="grid gap-3">
        {list.map((f) => (
          <div key={f.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-card p-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-accent">{TYPE_LABEL[f.type][lang]}</div>
              <div className="text-[15px] font-bold">{f.name}</div>
              <div className="mt-1 text-xs text-muted">
                {f.dist !== undefined ? `${f.dist.toFixed(1)} km · ${Math.max(2, Math.round(f.dist * 2.4))} min` : f.city}
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${f.phone}`} className="flex h-9.5 w-9.5 items-center justify-center rounded-lg border border-white/10 bg-card2">
                📞
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`}
                className="flex h-9.5 w-9.5 items-center justify-center rounded-lg border border-white/10 bg-card2"
              >
                🧭
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
