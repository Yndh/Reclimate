"use client";

import * as React from "react";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Survey } from "@/lib/types";

export type SurveyData = {
  id: string;
  createdAt: Date;
  questions: number;
  carbonFootprint: number;
};

const names = {
  createdAt: "Data ankiety",
  questions: "Pytania",
  carbonFootprint: "Ślad węglowy",
};

export const columns: ColumnDef<SurveyData>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Data ankiety
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase">
        {new Intl.DateTimeFormat("pl-PL", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(row.getValue("createdAt")))}
      </div>
    ),
  },
  {
    accessorKey: "questions",
    header: () => <div className="text-right">Pytania</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">{row.getValue("questions")}</div>
    ),
  },
  {
    accessorKey: "carbonFootprint",
    header: () => <div className="text-right">Ślad węglowy</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.getValue("carbonFootprint")
          ? `${row.getValue("carbonFootprint")}t CO₂`
          : "N/A"}
      </div>
    ),
  },
];

interface SurveyTableProps {
  surveys: Survey[];
}

export function AppTable({ surveys }: SurveyTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const data = React.useMemo(() => {
    return surveys.map((survey) => ({
      id: survey.id,
      createdAt: survey.createdAt,
      questions: survey.responses?.length ?? 0,
      carbonFootprint: survey.carbonFootprint ?? 0,
    }));
  }, [surveys]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: React.useCallback(setSorting, [setSorting]),
    onColumnVisibilityChange: React.useCallback(setColumnVisibility, [
      setColumnVisibility,
    ]),
    onRowSelectionChange: React.useCallback(setRowSelection, [setRowSelection]),
    getCoreRowModel: React.useMemo(() => getCoreRowModel(), []),
    getPaginationRowModel: React.useMemo(() => getPaginationRowModel(), []),
    getSortedRowModel: React.useMemo(() => getSortedRowModel(), []),
    getFilteredRowModel: React.useMemo(() => getFilteredRowModel(), []),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  const handlePreviousPage = React.useCallback(
    () => table.previousPage(),
    [table]
  );
  const handleNextPage = React.useCallback(() => table.nextPage(), [table]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Kolumny <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const columnName =
                  names[column.id as keyof typeof names] || column.id;
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columnName}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} wiersz(y).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
