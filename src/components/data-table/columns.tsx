"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { FeatureData } from "@/app/page";
import { FilterOption } from "./data-table-faceted-filter";

export const columns: ColumnDef<FeatureData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Feature Name' />
    ),
    cell: ({ row }) => {
      const featureType = row.original.feature_attributes?.feature_types;
      const featureTypeName = featureType?.name;
      const featureTypeColor = featureType?.color_hex;

      return (
        <div className='flex flex-col'>
          <span className='font-medium'>
            {row.getValue("name")}
          </span>
          {featureTypeName && (
            <Badge
              variant='outline'
              className='mt-1 w-fit text-xs px-1.5 py-0.5'
              style={{
                borderColor: featureTypeColor ?? undefined,
              }}
            >
              {featureTypeName}
            </Badge>
          )}
        </div>
      );
    },
    filterFn: (row, id, filterValue) => {
      if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
      const featureTypeId = row.original.feature_attributes?.feature_type_id;
      if (!featureTypeId) return false;
      return filterValue.includes(featureTypeId);
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => (
       <div className="max-w-[400px] line-clamp-2 overflow-hidden text-ellipsis">
         {row.getValue("description")}
        </div>
      ),
    enableSorting: false,
  },
  {
    id: "feature_attributes.statuses.name",
    accessorKey: "feature_attributes.statuses.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.feature_attributes?.statuses;
      const statusName = status?.name;
      const statusColor = status?.color_hex;

      if (!statusName) {
          return null;
      }

      return (
        <div className="flex items-center space-x-2">
          {statusColor && (
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: statusColor }}
            />
          )}
          <span>{statusName}</span>
        </div>
      );
    },
    filterFn: (row, id, filterValue) => {
      if (!Array.isArray(filterValue)) return true;
      const statusId = row.original.feature_attributes?.status_id;
      if (!statusId) return false;
      return filterValue.includes(statusId);
    },
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const statusA = rowA.original.feature_attributes?.statuses?.name ?? '';
      const statusB = rowB.original.feature_attributes?.statuses?.name ?? '';
      return statusA.localeCompare(statusB);
    },
  },
   {
    id: "feature_attributes.teams.name",
    accessorKey: "feature_attributes.teams.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Team' />
    ),
    cell: ({ row }) => {
      const teamName = row.original.feature_attributes?.teams?.name;
      return teamName ? <span>{teamName}</span> : null;
    },
    filterFn: (row, id, filterValue) => {
      if (!Array.isArray(filterValue)) return true;
      const teamId = row.original.feature_attributes?.team_id;
      if (!teamId) return false;
      return filterValue.includes(teamId);
    },
     enableSorting: true,
     sortingFn: (rowA, rowB, columnId) => {
       const teamA = rowA.original.feature_attributes?.teams?.name ?? '';
       const teamB = rowB.original.feature_attributes?.teams?.name ?? '';
       return teamA.localeCompare(teamB);
    },
  },
   {
    accessorKey: "feature_dependencies",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Dependencies' />
    ),
    cell: ({ row }) => {
      const dependencies = row.original.feature_dependencies;
      if (!dependencies || dependencies.length === 0) {
        return <span className="text-muted-foreground">-</span>;
      }

      const MAX_DISPLAY_DEPENDENCIES = 3;
      const displayedDependencies = dependencies.slice(0, MAX_DISPLAY_DEPENDENCIES);
      const hiddenCount = dependencies.length - displayedDependencies.length;

      const allDependencyNames = dependencies
        .map((dep) => dep.teams?.name)
        .filter(Boolean)
        .join(", ");

      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {displayedDependencies.map((dep) =>
                  dep.teams?.name ? (
                    <Badge key={dep.id} variant="secondary" className="flex-shrink-0">
                      {dep.teams.name}
                    </Badge>
                  ) : null
                )}
                {hiddenCount > 0 && (
                  <Badge variant="outline" className="flex-shrink-0">
                    +{hiddenCount}
                  </Badge>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{allDependencyNames}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "feature_attributes.moscow_priorities.name",
    accessorKey: "feature_attributes.moscow_priorities.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='MoSCoW' />
    ),
    cell: ({ row }) => {
      const priorityName = row.original.feature_attributes?.moscow_priorities?.name;
      return priorityName ? <span>{priorityName}</span> : null;
    },
    filterFn: (row, id, filterValue) => {
       if (!Array.isArray(filterValue)) return true;
       const priorityId = row.original.feature_attributes?.moscow_priority_id;
       if (!priorityId) return false;
       return filterValue.includes(priorityId);
    },
     enableSorting: true,
     sortingFn: (rowA, rowB, columnId) => {
       const prioA = rowA.original.feature_attributes?.moscow_priorities?.name ?? '';
       const prioB = rowB.original.feature_attributes?.moscow_priorities?.name ?? '';
       return prioA.localeCompare(prioB);
    },
  },
  {
    id: "feature_attributes.business_values.value",
    accessorKey: "feature_attributes.business_values.value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Business Value' />
    ),
    cell: ({ row }) => {
      const businessValue = row.original.feature_attributes?.business_values?.value;
      return businessValue !== null && businessValue !== undefined ? <span>{businessValue}</span> : null;
    },
    enableSorting: true,
     sortingFn: (rowA, rowB, columnId) => {
       const valA = rowA.original.feature_attributes?.business_values?.value ?? -1;
       const valB = rowB.original.feature_attributes?.business_values?.value ?? -1;
       return valA - valB;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        statusOptions: FilterOption[];
        priorityOptions: FilterOption[];
        teamOptions: FilterOption[];
        featureTypeOptions: FilterOption[];
        businessValueOptions: FilterOption[];
      } | undefined;

      return (
        <DataTableRowActions
          row={row}
          statusOptions={meta?.statusOptions ?? []}
          priorityOptions={meta?.priorityOptions ?? []}
          teamOptions={meta?.teamOptions ?? []}
          featureTypeOptions={meta?.featureTypeOptions ?? []}
          businessValueOptions={meta?.businessValueOptions ?? []}
        />
      );
    },
  },
];
