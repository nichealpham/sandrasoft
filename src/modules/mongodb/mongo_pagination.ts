export class Pagination {
    page: number;
    limit: number;
    total: number;

    constructor(page?: number, limit?: number) {
        if (!page || isNaN(page))
            page = 1;
        if (!limit || isNaN(limit))
            limit = 10;

        this.page = page;
        this.limit = limit;
        this.total = 0;
    }

    skip(): number {
        return (this.page - 1) * this.limit;
    }
}