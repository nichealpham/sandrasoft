"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultServerConfig = void 0;
exports.getDefaultServerConfig = () => {
    return JSON.parse(JSON.stringify({
        apiRoot: "/api",
        port: 3000,
        router: {},
    }));
};
//# sourceMappingURL=GetDefaultServerConfig.js.map