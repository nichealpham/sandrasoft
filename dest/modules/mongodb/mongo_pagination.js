"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pagination {
    constructor(page, limit) {
        if (!page || isNaN(page)) {
            page = 1;
        }
        if (!limit || isNaN(limit)) {
            limit = 10;
        }
        this.page = page;
        this.limit = limit;
        this.total = 0;
    }
    skip() {
        return (this.page - 1) * this.limit;
    }
}
exports.Pagination = Pagination;
//# sourceMappingURL=mongo_pagination.js.map