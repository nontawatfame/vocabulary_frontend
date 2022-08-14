export interface PaginationRes<T> {
    data: T[];
    total_data: number;
    total_pages: number;
}