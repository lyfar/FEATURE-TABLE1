"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter, FilterOption } from "@/components/data-table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { X, PlusCircle } from "lucide-react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import AddFeatureModal from "@/components/modals/add-feature-modal"
// Remove static filter options, we might fetch these dynamically or update them
// import { priority_options, status_options } from "../filters"

// TODO: Replace these with dynamically fetched options from Supabase or updated static ones
// const placeholder_status_options: FilterOption[] = [
//   { value: "Backlog", label: "Backlog" },
//   { value: "To Do", label: "To Do" },
//   { value: "In Progress", label: "In Progress" },
//   { value: "Done", label: "Done" },
//   { value: "Canceled", label: "Canceled" },
// ];
//
// const placeholder_moscow_options: FilterOption[] = [
//   { value: "Must Have", label: "Must Have" },
//   { value: "Should Have", label: "Should Have" },
//   { value: "Could Have", label: "Could Have" },
//   { value: "Won't Have", label: "Won't Have" },
// ];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  statusOptions: FilterOption[];
  priorityOptions: FilterOption[];
  teamOptions: FilterOption[];
  featureTypeOptions: FilterOption[];
  businessValueOptions: FilterOption[];
}

export function DataTableToolbar<TData>({
  table,
  statusOptions,
  priorityOptions,
  teamOptions,
  featureTypeOptions,
  businessValueOptions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [showAddModal, setShowAddModal] = React.useState(false);

  // Define the accessor keys used in columns.tsx
  const statusColId = "feature_attributes.statuses.name";
  const teamColId = "feature_attributes.teams.name";
  const priorityColId = "feature_attributes.moscow_priorities.name";
  // Use the column accessor key for Feature Type filter
  const featureTypeColId = "name"; // Feature Type is part of the name column display

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter features..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* Add Feature Type Filter */}
        {table.getColumn(featureTypeColId) && (
          <DataTableFacetedFilter
            column={table.getColumn(featureTypeColId)}
            title="Type"
            options={featureTypeOptions}
          />
        )}
        {table.getColumn(statusColId) && (
          <DataTableFacetedFilter
            column={table.getColumn(statusColId)}
            title="Status"
            options={statusOptions}
          />
        )}
        {table.getColumn(teamColId) && (
          <DataTableFacetedFilter
            column={table.getColumn(teamColId)}
            title="Team"
            options={teamOptions}
          />
        )}
        {table.getColumn(priorityColId) && (
          <DataTableFacetedFilter
            column={table.getColumn(priorityColId)}
            title="MoSCoW"
            options={priorityOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Feature
            </Button>
          </DialogTrigger>
          <AddFeatureModal showActionToggle={setShowAddModal} />
        </Dialog>
      </div>
    </div>
  )
}