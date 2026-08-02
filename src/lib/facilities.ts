import { createSupabaseServerClient } from "./supabaseServer";
import { Facility } from "./facilityTypes";

/**
 * Small illustrative seed set (approximate public coordinates) so the map and
 * list have something to show out of the box. In production, replace
 * `getFacilities()` below with a query against your `facilities` table
 * (see supabase/schema.sql) or a live provider (Google Places, OSM Overpass).
 */
export const SEED_FACILITIES: Facility[] = [
  { id: 'f1', name: 'Hôpital Charles Nicolle', type: 'hospital', lat: 36.8065, lng: 10.1815, city: 'Tunis', phone: '71578548' },
  { id: 'f2', name: 'Hôpital La Rabta', type: 'hospital', lat: 36.8095, lng: 10.1425, city: 'Tunis', phone: '71578000' },
  { id: 'f3', name: 'Clinique El Manar', type: 'clinic', lat: 36.8393, lng: 10.1518, city: 'Tunis', phone: '71885000' },
  { id: 'f4', name: 'Pharmacie Centrale', type: 'pharmacy', lat: 36.7990, lng: 10.1810, city: 'Tunis', phone: '71330033' },
  { id: 'f5', name: 'Protection Civile Tunis', type: 'civil_protection', lat: 36.8000, lng: 10.1800, city: 'Tunis', phone: '198' },
  { id: 'f6', name: 'Hôpital Sahloul', type: 'hospital', lat: 35.8433, lng: 10.5980, city: 'Sousse', phone: '73369411' },
  { id: 'f7', name: 'Hôpital Habib Bourguiba', type: 'hospital', lat: 34.7400, lng: 10.7500, city: 'Sfax', phone: '74405600' },
];


/**
 * Swap this for a Supabase query once the `facilities` table is populated:
 *
 *   const supabase = createSupabaseServerClient();
 *   const { data } = await supabase.from('facilities').select('*');
 *   return data ?? [];
 */
export async function getFacilities(): Promise<Facility[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("facilities")
    .select("*")
    .order("name");

  if (error) {
    console.error(error);
    return [];
  }

  return data as Facility[];
}