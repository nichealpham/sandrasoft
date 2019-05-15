export function splitPathAndFileNameFromUrl(fullPath: string): { file: string, path: string } {
    return {
        file: fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length),
        path: fullPath.slice(0, fullPath.lastIndexOf('/'))
    }
}