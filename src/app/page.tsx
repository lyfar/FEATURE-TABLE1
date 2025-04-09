import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { Shell } from "@/components/shells/shell";
import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/lib/supabase";
import { FilterOption } from "@/components/data-table/data-table-faceted-filter";

export const revalidate = 0;

export type FeatureData = Database["public"]["Tables"]["features"]["Row"] & {
  feature_attributes: (Database["public"]["Tables"]["feature_attributes"]["Row"] & {
    teams: Database["public"]["Tables"]["teams"]["Row"] | null;
    business_values: Database["public"]["Tables"]["business_values"]["Row"] | null;
    moscow_priorities: Database["public"]["Tables"]["moscow_priorities"]["Row"] | null;
    statuses: (Database["public"]["Tables"]["statuses"]["Row"] & { color_hex?: string | null }) | null;
    feature_types: (Database["public"]["Tables"]["feature_types"]["Row"] & { color_hex?: string | null }) | null;
  }) | null;
  feature_dependencies: (Database["public"]["Tables"]["feature_dependencies"]["Row"] & {
    teams: Pick<Database["public"]["Tables"]["teams"]["Row"], 'name'> | null;
  })[] | null;
};

// Comment out edge runtime to use default Node.js runtime
// export const runtime = 'edge';

async function getFeatures(): Promise<FeatureData[]> {
  const { data, error } = await supabase
    .from('features')
    .select(`
      *,
      feature_attributes (
        *,
        teams (*),
        business_values (*),
        moscow_priorities (*),
        statuses (*, color_hex),
        feature_types (*, color_hex)
      ),
      feature_dependencies (
        *,
        teams ( name )
      )
    `)
    .returns<FeatureData[]>();

  if (error) {
    console.error("Error fetching features:", error);
    throw new Error("Failed to fetch feature data");
  }

  if (!data) {
    return [];
  }

  return data;
}

async function getDropdownOptions() {
  const [statusesRes, prioritiesRes, teamsRes, featureTypesRes, businessValuesRes] = await Promise.all([
    supabase.from('statuses').select('id, name').order('name'),
    supabase.from('moscow_priorities').select('id, name').order('name'),
    supabase.from('teams').select('id, name').order('name'),
    supabase.from('feature_types').select('id, name').order('name'),
    supabase.from('business_values').select('id, value').order('value')
  ]);

  const mapToFilterOption = (item: { id: string, name: string }): FilterOption => ({ label: item.name, value: item.id });
  const mapBusinessValueToFilterOption = (item: { id: string, value: number }): FilterOption => ({ label: String(item.value), value: item.id });

  const statusOptions = statusesRes.data?.map(mapToFilterOption) ?? [];
  const priorityOptions = prioritiesRes.data?.map(mapToFilterOption) ?? [];
  const teamOptions = teamsRes.data?.map(mapToFilterOption) ?? [];
  const featureTypeOptions = featureTypesRes.data?.map(mapToFilterOption) ?? [];
  const businessValueOptions = businessValuesRes.data?.map(mapBusinessValueToFilterOption) ?? [];

  if (statusesRes.error) console.error("Error fetching statuses:", statusesRes.error);
  if (prioritiesRes.error) console.error("Error fetching priorities:", prioritiesRes.error);
  if (teamsRes.error) console.error("Error fetching teams:", teamsRes.error);
  if (featureTypesRes.error) console.error("Error fetching feature types:", featureTypesRes.error);
  if (businessValuesRes.error) console.error("Error fetching business values:", businessValuesRes.error);

  return { statusOptions, priorityOptions, teamOptions, featureTypeOptions, businessValueOptions };
}

export default async function FeaturePage() {
  const [features, { statusOptions, priorityOptions, teamOptions, featureTypeOptions, businessValueOptions }] = await Promise.all([
    getFeatures(),
    getDropdownOptions()
  ]);

  return (
    <Shell>
      <div className='flex h-full min-h-screen w-full flex-col'>
        <DataTable
          data={features}
          columns={columns as any}
          statusOptions={statusOptions}
          priorityOptions={priorityOptions}
          teamOptions={teamOptions}
          featureTypeOptions={featureTypeOptions}
          businessValueOptions={businessValueOptions}
        />
      </div>
    </Shell>
  );
}
