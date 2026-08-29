import type { Facility } from './facilityTypes';

/** Client-safe illustrative Tunisian facility data. */
export const SEED_FACILITIES: Facility[] = [
  { id: 'f1', name: 'Hôpital Charles Nicolle', type: 'hospital', lat: 36.8065, lng: 10.1815, city: 'Tunis', phone: '71578548' },
  { id: 'f2', name: 'Hôpital La Rabta', type: 'hospital', lat: 36.8095, lng: 10.1425, city: 'Tunis', phone: '71578000' },
  { id: 'f3', name: 'Clinique El Manar', type: 'clinic', lat: 36.8393, lng: 10.1518, city: 'Tunis', phone: '71885000' },
  { id: 'f4', name: 'Pharmacie Centrale', type: 'pharmacy', lat: 36.799, lng: 10.181, city: 'Tunis', phone: '71330033' },
  { id: 'f5', name: 'Protection Civile Tunis', type: 'civil_protection', lat: 36.8, lng: 10.18, city: 'Tunis', phone: '198' },
  { id: 'f6', name: 'Hôpital Sahloul', type: 'hospital', lat: 35.8433, lng: 10.598, city: 'Sousse', phone: '73369411' },
  { id: 'f7', name: 'Hôpital Habib Bourguiba', type: 'hospital', lat: 34.74, lng: 10.75, city: 'Sfax', phone: '74405600' },
];
