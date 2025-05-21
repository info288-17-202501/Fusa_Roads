import React from "react";
import { Pagination } from "react-bootstrap"; 

interface PaginationProps {
    // Propiedades comúnes
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;

    // Propiedades para react-table
    canPreviousPage?: boolean;
    canNextPage?: boolean;
    goToFirstPage?: () => void;
    goToLastPage?: () => void;
    previousPage?: () => void;
    nextPage?: () => void;
}

const NEIGHBORS = 1;

const PaginationComponent: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    canPreviousPage,
    canNextPage,
    goToFirstPage,
    goToLastPage,
    previousPage,
    nextPage
}) => {
    // Ver si estamos usando react-table o no
    const isReactTable =
        canPreviousPage !== undefined &&
        canNextPage !== undefined &&
        goToFirstPage !== undefined &&
        goToLastPage !== undefined &&
        previousPage !== undefined &&
        nextPage !== undefined;

    const handlePageClick = (page: number) => {
        onPageChange(page);
    }

    const handlePrevious = () => {
        if (isReactTable && previousPage) previousPage();
        else {
            if (currentPage > 1) onPageChange(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (isReactTable && nextPage) nextPage();
        else {
            if (currentPage < totalPages) onPageChange(currentPage + 1)
        }
    }
    
    const handleFirst = () => {
        if (isReactTable && goToFirstPage) goToFirstPage();
        else onPageChange(1);
    }

    const handleLast = () => {
        if (isReactTable && goToLastPage) goToLastPage();
        else onPageChange(totalPages);
    }

    const renderPageNumbers = () => {
        const pages: (number | string)[] = []
        const threshold = NEIGHBORS*2 + 5 // A partir de threshold (umbral) paginas se empiezan a mostrar los "..."

        if(totalPages <= threshold){ //Si hay pocas páginas, mostrar todas
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            const startPage = Math.max(2, currentPage - NEIGHBORS);
            const endPage = Math.min(totalPages - 1, currentPage + NEIGHBORS);

            pages.push(1);
            if(startPage > 2) pages.push("ELLIPSIS");

            for (let i = startPage; i<= endPage; i++) pages.push(i);

            if (endPage < totalPages - 1) pages.push("ELLIPSIS");

            pages.push(totalPages);
        }
        return pages;
    }

    return(
        <Pagination className="mt-4 justify-content-center">
            <Pagination.First
                disabled={isReactTable ? !canPreviousPage : currentPage === 1}
                onClick={handleFirst}
            />
            
            <Pagination.Prev
                disabled={isReactTable ? !canPreviousPage : currentPage === 1}
                onClick={handlePrevious}
            />
            {renderPageNumbers().map((pageNumber) => {
                if (pageNumber === "ELLIPSIS") return (<Pagination.Ellipsis disabled/>)
                return(
                    <Pagination.Item
                        key={pageNumber}
                        active={currentPage === pageNumber}
                        onClick={() => handlePageClick(pageNumber as number)}
                    >
                        {pageNumber}
                    </Pagination.Item>
                )
            })}
            {/* {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                    key={idx}
                    active={currentPage === idx+1}
                    onClick={() => handlePageClick(idx+1)}
                >
                    {idx + 1}
                </Pagination.Item>
            ))} */}
            <Pagination.Next
                disabled={isReactTable ? !canNextPage : currentPage === totalPages}
                onClick={handleNext}
            />

            <Pagination.Last
                disabled={isReactTable ? !canNextPage : currentPage === totalPages}
                onClick={handleLast}
            />

        </Pagination>
    )
}
export default PaginationComponent