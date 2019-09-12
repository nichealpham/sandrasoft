// Import sub-modules
import { ServerConfig } from "../interfaces/ServerConfig";

export const getDefaultServerConfig = (): ServerConfig => {
    return JSON.parse(JSON.stringify({
        apiRoot: "/api",
        port: 3000,
        router: {},
    }));
};