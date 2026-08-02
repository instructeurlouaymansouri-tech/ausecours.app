'use client';

import { useMemo, useState } from 'react';
import { CPR_CATEGORIES, CPR_VIDEOS, CprVideo } from '@/lib/cprData';
import { useI18n } from '@/lib/i18n';

export default function CprLibrary() {
  const { lang } = useI18n();
  const [activeCat, setActiveCat] = useState<CprVideo['category'] | 'all'>('all');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [playing, setPlaying] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      CPR_VIDEOS.filter(
        (v) =>
          (activeCat === 'all' || v.category === activeCat) &&
          (query.trim() === '' || v.title.toLowerCase().includes(query.toLowerCase()))
      ),
    [activeCat, query]
  );

  function toggleFav(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const placeholderNote =
    lang === 'fr'
      ? 'Emplacement réservé — ajoutez votre lien vidéo ici.'
      : lang === 'en'
      ? 'This is a placeholder slot — plug in your own video link here.'
      : lang === 'ar'
      ? 'هذا مكان مؤقت — أضف رابط فيديوك هنا.'
      : 'هاذا مكان فاضي — زيد رابط الفيديو متاعك هوني.';

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === 'fr' ? 'Rechercher…' : lang === 'en' ? 'Search…' : 'دور...'}
          className="rounded-full border border-white/10 bg-card px-4 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {CPR_CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCat(c.key)}
            className={`rounded-full border px-3.5 py-2 text-[12.5px] font-semibold ${
              activeCat === c.key ? 'border-transparent bg-accent text-white' : 'border-white/10 bg-card text-muted'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => (
          <div key={v.id} className="overflow-hidden rounded-2xl border border-white/10 bg-card">
            <button
              onClick={() => (v.embedUrl ? setPlaying(v.embedUrl) : alert(placeholderNote))}
              className="relative flex h-[150px] w-full items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#232323]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/90">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px]">{v.durationLabel}</span>
            </button>
            <div className="p-3.5">
              <h4 className="mb-1.5 text-sm font-bold">{v.title}</h4>
              <p className="text-xs text-muted">{v.description}</p>
              <div className="mt-2.5 flex items-center justify-between">
                <button
                  onClick={() => toggleFav(v.id)}
                  className={`text-lg ${favorites.has(v.id) ? 'text-accent' : 'text-muted'}`}
                  aria-label="favorite"
                >
                  {favorites.has(v.id) ? '★' : '☆'}
                </button>
                <span className="text-[11px] text-muted">{v.category.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {playing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-5" onClick={() => setPlaying(null)}>
          <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-black" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPlaying(null)}
              className="absolute -top-11 right-0 rounded-lg border border-white/10 bg-card px-3 py-2 text-sm"
            >
              {lang === 'fr' ? 'Fermer' : lang === 'en' ? 'Close' : 'غلق'}
            </button>
            <iframe src={`${playing}?autoplay=1`} className="h-full w-full border-0" allow="autoplay; encrypted-media" allowFullScreen />
          </div>
        </div>
      )}
    </div>
  );
}
