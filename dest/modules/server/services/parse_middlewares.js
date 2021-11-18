"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMiddlewares = void 0;
const Ramda = require("ramda");
exports.parseMiddlewares = (middlewares = {}) => {
    if (Ramda.isEmpty(middlewares)) {
        return [];
    }
    const result = [];
    for (const middlewareName of Object.keys(middlewares)) {
        result.push(middlewares[middlewareName]);
    }
    return result;
};
//# sourceMappingURL=parse_middlewares.js.map