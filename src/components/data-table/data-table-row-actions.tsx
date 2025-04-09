"use client";

import * as React from "react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Copy, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { FeatureData } from "@/app/page";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import EditDialog from "@/components/modals/edit-modal";
import DeleteDialog from "@/components/modals/delete-modal";
import ViewFeatureModal from "@/components/modals/view-feature-modal";
import { FilterOption } from "./data-table-faceted-filter";

interface DataTableRowActionsProps<TData extends FeatureData> {
  row: Row<TData>;
  statusOptions: FilterOption[];
  teamOptions: FilterOption[];
  priorityOptions: FilterOption[];
  featureTypeOptions: FilterOption[];
  businessValueOptions: FilterOption[];
}

export function DataTableRowActions<TData extends FeatureData>({
  row,
  statusOptions,
  teamOptions,
  priorityOptions,
  featureTypeOptions,
  businessValueOptions,
}: DataTableRowActionsProps<TData>) {
  const feature = row.original;
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showViewDialog, setShowViewDialog] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[200px]'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(feature.id)}
            disabled={!feature.id}
          >
            <Copy className='mr-2 h-4 w-4' />
            Copy Feature ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowViewDialog(true)}>
            <Eye className='mr-2 h-4 w-4' />
            View Feature
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
            <Pencil className='mr-2 h-4 w-4' />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className='text-red-600'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <EditDialog
            feature={feature}
            statusOptions={statusOptions}
            teamOptions={teamOptions}
            priorityOptions={priorityOptions}
            featureTypeOptions={featureTypeOptions}
            businessValueOptions={businessValueOptions}
            onClose={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DeleteDialog
          feature={feature}
          isOpen={showDeleteDialog}
          showActionToggle={setShowDeleteDialog}
        />
      </Dialog>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <ViewFeatureModal feature={feature} onOpenChange={setShowViewDialog} />
      </Dialog>
    </>
  );
}
