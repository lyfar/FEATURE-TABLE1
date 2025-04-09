"use client";

// * * This is just a demostration of edit modal, actual functionality may vary

import { z } from "zod";
import { FeatureData } from "@/app/page";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { label_options, priority_options, status_options } from "../filters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { supabase } from "@/lib/supabaseClient";
import { FilterOption } from "../data-table/data-table-faceted-filter";
import { DialogFooter } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

type EditProps = {
  feature: FeatureData;
  statusOptions: FilterOption[];
  teamOptions: FilterOption[];
  priorityOptions: FilterOption[];
  featureTypeOptions: FilterOption[];
  businessValueOptions: FilterOption[];
  onClose: () => void;
};

const editFeatureSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Feature Name Required" }),
  description: z.string().optional(),
  status_id: z.string().uuid().optional().nullable(),
  team_id: z.string().uuid().optional().nullable(),
  moscow_priority_id: z.string().uuid().optional().nullable(),
  feature_type_id: z.string().uuid().optional().nullable(),
  business_value_id: z.string().uuid().optional().nullable(),
});

type EditFeatureSchemaType = z.infer<typeof editFeatureSchema>;

export default function EditDialog({
  feature,
  statusOptions,
  teamOptions,
  priorityOptions,
  featureTypeOptions,
  businessValueOptions,
  onClose,
}: EditProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<EditFeatureSchemaType>({
    resolver: zodResolver(editFeatureSchema),
    defaultValues: {
      id: feature.id,
      name: feature.name,
      description: feature.description ?? "",
      status_id: feature.feature_attributes?.status_id ?? undefined,
      team_id: feature.feature_attributes?.team_id ?? undefined,
      moscow_priority_id: feature.feature_attributes?.moscow_priority_id ?? undefined,
      feature_type_id: feature.feature_attributes?.feature_type_id ?? undefined,
      business_value_id: feature.feature_attributes?.business_value_id ?? undefined,
    },
  });

  async function onSubmit(values: EditFeatureSchemaType) {
    setIsSaving(true);
    let success = false;
    try {
      console.log("Submitting edit:", values);
      const { error: featureError } = await supabase
        .from('features')
        .update({ name: values.name, description: values.description })
        .eq('id', values.id);

      if (featureError) {
        console.error("Error updating feature:", featureError);
        toast.error("Failed to update feature.");
        return;
      }

      const attributesExist = !!feature.feature_attributes?.id;
      const attributeData = {
        feature_id: values.id,
        status_id: values.status_id,
        team_id: values.team_id,
        moscow_priority_id: values.moscow_priority_id,
        feature_type_id: values.feature_type_id,
        business_value_id: values.business_value_id,
      };

      let attributeResult;
      if (attributesExist) {
        attributeResult = await supabase
          .from('feature_attributes')
          .update(attributeData)
          .eq('feature_id', values.id);
      } else {
        attributeResult = await supabase
          .from('feature_attributes')
          .insert(attributeData);
      }

      if (attributeResult.error) {
        console.error("Error saving feature attributes:", attributeResult.error);
        toast.error("Failed to save feature attributes.");
        return;
      }

      toast.success("Feature updated successfully!");
      success = true;
      router.refresh();
      if (success) {
          onClose();
      }

    } catch (error) {
        console.error("An unexpected error occurred during Supabase update:", error);
        toast.error("An unexpected error occurred during the database update.");
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Feature Details</DialogTitle>
      </DialogHeader>
      <div className='py-4 max-h-[70vh] overflow-y-auto pr-4'>
        <Form {...form}>
          <form id="edit-feature-form" onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feature Name</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Feature description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select Status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='team_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select Team' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {teamOptions.map((team) => (
                          <SelectItem key={team.value} value={team.value}>
                            {team.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='moscow_priority_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MoSCoW Priority</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select Priority' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {priorityOptions.map((prio) => (
                          <SelectItem key={prio.value} value={prio.value}>
                            {prio.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='feature_type_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feature Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select Type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {featureTypeOptions.map((ftype) => (
                          <SelectItem key={ftype.value} value={ftype.value}>
                            {ftype.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='business_value_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Value</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select Value' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {businessValueOptions.map((bval) => (
                          <SelectItem key={bval.value} value={bval.value}>
                            {bval.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" form="edit-feature-form" disabled={isSaving}>
             {isSaving ? "Saving..." : "Save and Close"}
          </Button>
      </DialogFooter>
    </>
  );
}
