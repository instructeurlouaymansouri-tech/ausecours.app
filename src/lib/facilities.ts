import { createSupabaseServerClient } from "./supabaseServer";
import { Facility } from "./facilityTypes";
export { SEED_FACILITIES } from "./facilitySeed";

/** Server-only facility loader. */
export async function getFacilities(): Promise<Facility[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("facilities").select("*").order("name");
  if (error) {
    console.error(error);
    return [];
  }
  return data as Facility[];
}
