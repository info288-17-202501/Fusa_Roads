import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    getPaginationRowModel
} from '@tanstack/react-table';
import { useState } from 'react'
import { faCirclePlus, faFileCsv, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputGroup, FormControl, Button, Form } from 'react-bootstrap';
import PaginationComponent from './PaginationComponent';

interface Props<T>{
    data: T[];
    columns: ColumnDef<T, unknown>[];
    showNewButton?: boolean;
    onClickNewButton?: () => void;
    showCargaMasivaButton?: boolean;
    onClickCargaMasivaButton?: () => void;
}

function Table<T extends { id: number }>({
    data,
    columns,
    showNewButton = false,
    onClickNewButton,
    showCargaMasivaButton = false,
    onClickCargaMasivaButton
}: Props<T>) {
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
                    <Button className="d-flex gap-2 align-items-center" variant='primary' onClick={onClickNewButton}>
                        <FontAwesomeIcon className="my-auto" icon={faCirclePlus}/>
                        Nuevo
                    </Button>
                )}

                {showCargaMasivaButton && (
                    <Button className="d-flex gap-2 align-items-center" variant='outline-primary' onClick={onClickCargaMasivaButton}>
                        <FontAwesomeIcon className="my-auto" icon={faFileCsv}/>
                        Carga Masiva
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

                <Form.Select
                    className='w-auto ms-1 mt-3'
                    value={table.getState().pagination.pageSize}
                    onChange={e => table.setPageSize(Number(e.target.value))}
                >
                    {[1,2,3,5,10,20,50].map(size => (
                        <option key={size} value={size}>
                                Ver {size}
                        </option>
                    ))}
                </Form.Select>

                <PaginationComponent
                    currentPage={table.getState().pagination.pageIndex + 1}
                    totalPages={table.getPageCount()}
                    onPageChange={(page) => table.setPageIndex(page - 1)}
                    canPreviousPage={table.getCanPreviousPage()}
                    canNextPage={table.getCanNextPage()}
                    goToFirstPage={() => table.setPageIndex(0)}
                    goToLastPage={() => table.setPageIndex(table.getPageCount() - 1)}
                    previousPage={() => table.previousPage()}
                    nextPage={() => table.nextPage()}
                />
            </div>
        </div>
    )
}

export default Table