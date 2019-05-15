export declare class Pagination {
    page: number;
    limit: number;
    total: number;
    constructor(page?: number, limit?: number);
    skip(): number;
}
