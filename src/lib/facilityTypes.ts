export type FacilityType =
  | "hospital"
  | "clinic"
  | "pharmacy"
  | "civil_protection"
  | "ambulance";

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  lat: number;
  lng: number;
  city: string;
  phone: string;
}

export const TUNISIAN_CITIES = [
  "Tunis",
  "Sousse",
  "Sfax",
  "Ariana",
  "Bizerte",
  "Nabeul",
  "Monastir",
  "Kairouan",
  "Gabès",
  "Djerba",
];

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}