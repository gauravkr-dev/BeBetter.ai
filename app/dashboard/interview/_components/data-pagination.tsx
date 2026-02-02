import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/optics/pagination";

interface DataPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}
export const DataPagination = ({ page, totalPages, onPageChange }: DataPaginationProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const PaginationItemAny: any = PaginationItem;

    // Show a sliding window of page buttons with a maximum visible pages
    const maxVisible = 3;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisible) {
        const half = Math.floor(maxVisible / 2);
        // center the window around current `page` when possible
        startPage = Math.max(1, page - half);
        // make sure window doesn't overflow the last page
        startPage = Math.min(startPage, totalPages - maxVisible + 1);
        endPage = startPage + maxVisible - 1;
    }

    return (
        <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            className="my-4"
        >
            <PaginationContent>
                <PaginationPrevious
                    disabled={page <= 1}
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                >
                    Previous
                </PaginationPrevious>

                {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                    const p = startPage + i;
                    return (
                        <PaginationItemAny key={p} page={p}>
                            <PaginationLink
                                isActive={p === page}
                                onClick={() => onPageChange(p)}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItemAny>
                    );
                })}

                <PaginationNext
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                >
                    Next
                </PaginationNext>
            </PaginationContent>
        </Pagination>
    );
}