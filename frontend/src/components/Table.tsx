import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    getPaginationRowModel
} from '@tanstack/react-table';
import { useState } from 'react'
import { faCirclePlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Pagination } from 'react-bootstrap';


import { InputGroup, FormControl, Button } from 'react-bootstrap';


interface Props<T>{
    data: T[];
    columns: ColumnDef<T, unknown>[];
    showNewButton?: boolean;
}

function Table<T extends { id: number }>({ data, columns, showNewButton = false }: Props<T>) {
    const [globalFilter, setGlobalFilter] = useState("");

    const filterableKeys = columns
        .map((col) => {
            if ('accessorKey' in col && typeof col.accessorKey === 'string') {
            return col.accessorKey;
            }
            return null;
        })
        .filter(Boolean) as string[];

  
    const table = useReactTable({
        data,
        columns,
        state:{
            globalFilter
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: (row, _columnId, filterValue: string) => {
            return filterableKeys.some((key) => {
                const value = row.original[key as keyof T];
                return String(value).toLowerCase().includes(filterValue.toLowerCase());
            });
          }
    });

    return (
        <div>
            <div className="d-flex justify-content-end gap-3 mb-3">
                <InputGroup className='w-25' style={{ minWidth: 66}}>
                    <FormControl
                        type="text"
                        placeholder="Buscar..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className='border-end-0'
                        style={{ outline: 'none', boxShadow: 'none', border: '1px solid rgb(222, 226, 230)'}}
                    />
                    <InputGroup.Text className='bg-transparent border-start-0'>
                        <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                </InputGroup>

                {showNewButton && (
                    <Button className="d-flex gap-2" variant='primary'>
                        <FontAwesomeIcon className="my-auto" icon={faCirclePlus}/>
                        Nuevo
                    </Button>
                )}
            </div>
            <div className='table-responsive'>
                <table className='w-100'>
                    <thead style={{backgroundColor:"#ccc"}}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className='px-4 py-2' style={{border: '1px solid #b2b2b2'}}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.map((row, index) => (
                            <tr key={row.id} style={{backgroundColor: index % 2 === 0 ? '#ffffff' : '#eee'}}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className='px-4 py-2' style={{border: '1px solid #b2b2b2'}}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination  className="mt-4 justify-content-center">
                    <Pagination.First disabled={!table.getCanPreviousPage()} onClick={() => table.setPageIndex(0)}/>
                    <Pagination.Prev disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}/>
                    {[...Array(table.getPageCount())].map((_, idx) => (
                        <Pagination.Item
                            key={idx}
                            active={table.getState().pagination.pageIndex === idx}
                            onClick={() => table.setPageIndex(idx)}
                        >
                            {idx+1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}/>
                    <Pagination.Last disabled={!table.getCanNextPage()} onClick={() => table.setPageIndex(table.getPageCount()-1)}/>
                </Pagination>
            </div>
        </div>
    )
}

export default Table