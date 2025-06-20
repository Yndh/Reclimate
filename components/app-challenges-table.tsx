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
import { Challenge } from "@/lib/types";
import { CheckCircle2, CircleX } from "lucide-react";

export type ChallengeData = {
  id: string;
  startDate: Date;
  endDate: Date;
  title: string;
  points: number;
  isCompleted: boolean;
};

const names = {
  durationDate: "Czas trwania",
  title: "Tytuł",
  points: "Punkty",
  isCompleted: "Ukończone",
};

const formatChallengeDate = (date: Date) => {
  const formattedDate = date.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const [day, month, year] = formattedDate.split(" ");
  const capitalizedMonth = month.charAt(0).toLocaleUpperCase() + month.slice(1);
  return { day, month: capitalizedMonth, year };
};

export const columns: ColumnDef<ChallengeData>[] = [
  {
    accessorKey: "durationDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Czas trwania
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorFn: (row) => {
      return `${new Date(row.startDate).toISOString()}-${new Date(
        row.endDate
      ).toISOString()}`;
    },
    id: "durationDate",
    cell: ({ row }) => {
      const startDate = new Date(row.original.startDate);
      const endDate = new Date(row.original.endDate);
      const start = formatChallengeDate(startDate);
      const end = formatChallengeDate(endDate);
      const isSameMonthAndYear =
        start.month === end.month && start.year === end.year;

      return (
        <div className="lowercase">
          {isSameMonthAndYear
            ? `${start.day} - ${end.day} ${start.month} ${start.year}`
            : `${start.day} ${start.month} ${start.year} - ${end.day} ${end.month} ${end.year}`}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: () => <div>Tytuł</div>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "points",
    header: () => <div>Ilość punktów</div>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("points")}</div>
    ),
  },
  {
    accessorKey: "isCompleted",
    header: () => <div>Ukończone</div>,
    cell: ({ row }) => (
      <div className="flex justify-start font-medium">
        {row.getValue("isCompleted") ? (
          <CheckCircle2 className="text-green-700" />
        ) : (
          <CircleX className="text-red-700" />
        )}
      </div>
    ),
  },
];

interface AppChallengesTableProps {
  challenges: Challenge[];
}

export function AppChallengesTable({ challenges }: AppChallengesTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const data = React.useMemo(() => {
    return challenges.map((challenge) => ({
      id: challenge.id,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
      title: challenge.title,
      points: challenge.points,
      isCompleted: challenge.isCompleted,
    }));
  }, [challenges]);

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
                  Brak wyników.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Wybrano {table.getFilteredSelectedRowModel().rows.length} z{" "}
          {table.getFilteredRowModel().rows.length} wiersz(y).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!table.getCanPreviousPage()}
          >
            Poprzednia
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!table.getCanNextPage()}
          >
            Następna
          </Button>
        </div>
      </div>
    </div>
  );
}
