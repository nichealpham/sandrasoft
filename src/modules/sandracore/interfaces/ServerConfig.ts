import { ServerRoute } from "./ServerRoute";

export interface ServerConfig {
    apiRoot: string;
    port: number | string;
    router?: {
        [routeName: string]: ServerRoute;
    };
    useHttps?: {
        keyFilePath: string;
        certFilePath: string;
        passphrase: string;
    };
}