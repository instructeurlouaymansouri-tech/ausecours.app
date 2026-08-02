export interface CprVideo {
  id: string;
  category:
    | 'adult_cpr'
    | 'child_cpr'
    | 'infant_cpr'
    | 'aed'
    | 'choking_adult'
    | 'choking_infant'
    | 'recovery_position'
    | 'bleeding'
    | 'burns';
  title: string;
  description: string;
  durationLabel: string;
  /** Real embeddable URL, or null for a placeholder slot the team fills in later. */
  embedUrl: string | null;
}

export const CPR_CATEGORIES: { key: CprVideo['category'] | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'adult_cpr', label: 'Adult CPR' },
  { key: 'child_cpr', label: 'Child CPR' },
  { key: 'infant_cpr', label: 'Infant CPR' },
  { key: 'aed', label: 'AED' },
  { key: 'choking_adult', label: 'Choking Adult' },
  { key: 'choking_infant', label: 'Choking Infant' },
  { key: 'recovery_position', label: 'Recovery Position' },
  { key: 'bleeding', label: 'Bleeding Control' },
  { key: 'burns', label: 'Burns' },
];

/**
 * Replace `embedUrl: null` entries with your own licensed or locally-produced
 * videos before shipping. One real, freely-embeddable public-education video
 * is included so the player wiring can be tested end-to-end.
 */
export const CPR_VIDEOS: CprVideo[] = [
  {
    id: 'v1',
    category: 'adult_cpr',
    title: 'Official Hands-Only CPR (American Heart Association)',
    description: 'Official AHA demonstration video — replace with local content anytime.',
    durationLabel: '2:48',
    embedUrl: 'https://www.youtube.com/embed/zSgmledxFe8',
  },
  { id: 'v2', category: 'child_cpr', title: 'Child CPR — placeholder', description: 'Insert your licensed/local child CPR video here.', durationLabel: '3:10', embedUrl: null },
  { id: 'v3', category: 'infant_cpr', title: 'Infant CPR — placeholder', description: 'Insert an infant CPR training video here.', durationLabel: '2:35', embedUrl: null },
  { id: 'v4', category: 'aed', title: 'Using an AED — placeholder', description: 'Insert your AED walkthrough video here.', durationLabel: '1:58', embedUrl: null },
  { id: 'v5', category: 'choking_adult', title: 'Choking — Adult (Heimlich)', description: 'Abdominal thrust technique walkthrough.', durationLabel: '2:12', embedUrl: null },
  { id: 'v6', category: 'choking_infant', title: 'Choking — Infant', description: 'Back blows / chest thrusts for infants.', durationLabel: '2:05', embedUrl: null },
  { id: 'v7', category: 'recovery_position', title: 'Recovery Position', description: 'How to safely place an unconscious breathing person.', durationLabel: '1:40', embedUrl: null },
  { id: 'v8', category: 'bleeding', title: 'Bleeding Control', description: 'Direct pressure and wound care basics.', durationLabel: '2:20', embedUrl: null },
  { id: 'v9', category: 'burns', title: 'Burns — First Response', description: 'Cooling, covering, and when to seek help.', durationLabel: '2:00', embedUrl: null },
];
