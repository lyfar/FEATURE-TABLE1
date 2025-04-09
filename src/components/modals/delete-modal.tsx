"use client"

// * * This is just a demostration of delete modal, actual functionality may vary

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { FeatureData } from "@/app/page";
  import { Button } from "@/components/ui/button";
  import { supabase } from "@/lib/supabaseClient";
  import { useRouter } from 'next/navigation';
  import { toast } from "sonner";
  import * as React from "react";
  
  type DeleteProps = {
    feature: FeatureData;
    isOpen: boolean;
    showActionToggle: (open: boolean) => void;
  };
  
  export default function DeleteDialog({
    feature,
    isOpen,
    showActionToggle,
  }: DeleteProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDelete = async () => {
      setIsDeleting(true);
      try {
        console.log("Attempting to delete feature:", feature.id);

        const { error: attrError } = await supabase
          .from('feature_attributes')
          .delete()
          .eq('feature_id', feature.id);

        if (attrError) {
           console.error("Error deleting feature attributes:", attrError);
        }

        const { error: featureError } = await supabase
          .from('features')
          .delete()
          .eq('id', feature.id);

        if (featureError) {
          console.error("Error deleting feature:", featureError);
          toast.error(`Failed to delete feature: ${featureError.message}`);
        } else {
          toast.success("Feature deleted successfully!");
          showActionToggle(false);
          router.refresh();
        }
      } catch (error) {
          console.error("An unexpected error occurred during deletion:", error);
          toast.error("An unexpected error occurred during deletion.");
      } finally {
        setIsDeleting(false);
      }
    };

    return (
      <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure absolutely sure ?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You are about to delete Feature:
              <b> {feature.name}</b>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }