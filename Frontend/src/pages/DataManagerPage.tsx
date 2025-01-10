'use client';

import * as React from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ChevronDown } from 'lucide-react';

export default function DataManagerPage() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');
    const dataTables = ['holiday', 'passenger'];
    const [selectedTable, setSelectedTable] = React.useState(dataTables[0]);

    // Get data from Redux store
    const holidays = useSelector((state: RootState) => state.holidays.filteredData);
    const passengers = useSelector((state: RootState) => state.passengers.filteredData);

    // Select data based on the selected table
    const data = selectedTable === 'holiday' ? holidays : passengers;

    // Pagination settings
    const rowsPerPage = 20;
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const [currentPage, setCurrentPage] = React.useState(1);

    // Paginate data
    const paginatedData = React.useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data
            .filter((item) =>
                Object.values(item).join(' ').toLowerCase().includes(globalFilter.toLowerCase())
            )
            .slice(startIndex, endIndex);
    }, [data, currentPage, rowsPerPage, globalFilter]);

    // Define columns dynamically based on the selected table
    const columns: ColumnDef<any>[] = React.useMemo(() => {
        if (selectedTable === 'holiday') {
            return [
                { accessorKey: 'country_name', header: 'Country Name' },
                { accessorKey: 'country_code', header: 'Country Code' },
                {
                    accessorKey: 'date',
                    header: 'Date',
                    cell: ({ row }) => new Date(row.getValue('date')).toLocaleDateString(),
                },
                { accessorKey: 'travel_reason', header: 'Travel Reason' },
                { accessorKey: 'type_of_travel', header: 'Type of Travel' },
            ];
        } else if (selectedTable === 'passenger') {
            return [
                { accessorKey: 'country_code', header: 'Country Code' },
                { accessorKey: 'year', header: 'Year' },
                { accessorKey: 'month', header: 'Month' },
                { accessorKey: 'total_passenger', header: 'Total Passengers' },
                { accessorKey: 'domestic', header: 'Domestic Passengers' },
                { accessorKey: 'international', header: 'International Passengers' },
                { accessorKey: 'total_OS', header: 'Total OS' },
            ];
        }
        return [];
    }, [selectedTable]);

    const table = useReactTable({
        data: paginatedData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center py-4 gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            {selectedTable} <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {dataTables.map((value) => (
                            <DropdownMenuCheckboxItem
                                key={value}
                                checked={selectedTable === value}
                                onCheckedChange={() => {
                                    setSelectedTable(value);
                                    setCurrentPage(1); // Reset to first page when switching tables
                                }}
                            >
                                {value}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Input
                    placeholder="Search across all columns..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
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
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
