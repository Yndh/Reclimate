"use client";

import * as React from "react";
import { CalendarIcon, CaretSortIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HoverCard, HoverCardContent } from "./ui/hover-card";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

export interface Leaderboard {
  name: string;
  image: string;
  createdAt: Date;
  points: number;
}

interface AppRankingProps {
  data: Leaderboard[];
}

export function AppRanking({ data }: AppRankingProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full">
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
          {table.getFilteredSelectedRowModel().rows.length} z{" "}
          {table.getFilteredRowModel().rows.length} wiersz(y).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export const columns: ColumnDef<Leaderboard>[] = [
  {
    accessorKey: "rank",
    header: "Miejsce",
    cell: ({ row }) => {
      const rank = row.index + 1;
      const medalEmoji =
        rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "\u00A0";
      return (
        <div>
          {medalEmoji} {rank}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nazwa użytkownika",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const image = row.original.image;
      const joined = row.original.createdAt;
      const rank = row.index + 1;
      const points = row.original.points;

      const date = new Date(joined);
      const formatedDate = date.toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "long",
      });
      const joinedDate =
        formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1);

      return (
        <div className="font-medium">
          <HoverCard>
            <HoverCardTrigger
              asChild
              className="hover:underline cursor-pointer"
            >
              <span>{name}</span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage src={image} />
                  <AvatarFallback>pfp</AvatarFallback>
                </Avatar>
                <div className="space-y-4 w-full">
                  <div>
                    <h4 className="text-sm font-semibold">@{name}</h4>
                    <div className="flex items-center pt-2">
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                      <span className="text-xs text-muted-foreground">
                        Dołączono {joinedDate}
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center w-full text-lg">
                    <div className="flex flex-col w-full text-center">
                      <span>#{rank}</span>
                      <span className="text-sm text-muted-foreground">
                        Miejsce
                      </span>
                    </div>
                    <Separator orientation="vertical" className="h-[35px]" />
                    <div className="flex flex-col w-full text-center">
                      <span>{points}</span>
                      <span className="text-xs text-muted-foreground">
                        Punktów
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      );
    },
  },
  {
    accessorKey: "points",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Punkty
          <CaretSortIcon className="ml-2 h-4 w-2" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase ml-4">{row.getValue("points")}</div>
    ),
  },
];
