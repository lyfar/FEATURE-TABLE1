"use client";

import { FeatureData } from "@/app/page";
import { Badge } from "@/components/ui/badge";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type ViewFeatureProps = {
  feature: FeatureData;
  onOpenChange: (open: boolean) => void; // Function to close the dialog
};

// Helper component to display a label and value
const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="mb-2">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-sm">{value || "-"}</p>
  </div>
);

export default function ViewFeatureModal({ feature, onOpenChange }: ViewFeatureProps) {
  const attributes = feature.feature_attributes;
  const dependencies = feature.feature_dependencies;

  return (
    <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Feature Details: {feature.name}</DialogTitle>
        <DialogDescription>
          Viewing details for the feature.
        </DialogDescription>
      </DialogHeader>
      <Separator />
      <div className="grid gap-4 py-4">
        <DetailItem label="ID" value={feature.id} />
        <DetailItem label="Name" value={feature.name} />
        <DetailItem label="Description" value={feature.description} />
        <Separator />
        <h4 className="text-sm font-semibold mb-2">Attributes</h4>
        <DetailItem label="Status" value={attributes?.statuses?.name} />
        <DetailItem label="Team" value={attributes?.teams?.name} />
        <DetailItem label="Feature Type" value={attributes?.feature_types?.name} />
        <DetailItem label="MoSCoW Priority" value={attributes?.moscow_priorities?.name} />
        <DetailItem label="Business Value" value={attributes?.business_values?.value} />
        <Separator />
         <h4 className="text-sm font-semibold mb-2">Dependencies</h4>
          {dependencies && dependencies.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {dependencies.map((dep) => (
                 dep.teams?.name ? <Badge key={dep.id} variant="secondary">{dep.teams.name}</Badge> : null
              ))}
            </div>
          ) : (
             <p className="text-sm text-muted-foreground">No dependencies.</p>
          )}
      </div>
       <DialogFooter className="sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
    </DialogContent>
  );
} 