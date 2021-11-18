"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitPathAndFileNameFromUrl = void 0;
function splitPathAndFileNameFromUrl(fullPath) {
    return {
        file: fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length),
        path: fullPath.slice(0, fullPath.lastIndexOf('/')),
    };
}
exports.splitPathAndFileNameFromUrl = splitPathAndFileNameFromUrl;
//# sourceMappingURL=split_path_filename_from_url.js.map