import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/optics/pagination";

interface DataPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}
export const DataPagination = ({ page, totalPages, onPageChange }: DataPaginationProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const PaginationItemAny: any = PaginationItem;

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

                {Array.from({ length: totalPages }, (_, i) => {
                    const p = i + 1;
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
    )
}