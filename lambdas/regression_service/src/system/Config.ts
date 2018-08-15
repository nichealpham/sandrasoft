import { ConfigPrivateKeys } from './keys/ConfigPrivateKeys';

export class ServiceConfig {
    static NAME = 'Simple Tensorflow.js Micro-Serverless Service';
    static EXPRESS_PORT = 2001;
    static API_BASE = 'https://70jfbnsgr5.execute-api.ap-southeast-1.amazonaws.com';
    static STAGE = 'dev';
    
    static CLOUD_PROVIDER = {
        NAME: 'Amazon Web Services',
        SERVICE: 'AWS Lambda',
        RUNTIME: 'nodejs8.10',
        REGION: 'ap-southeast-1',
        MEMORYSIZE: 1024,
        TIMEOUT: 300,
    };

    static FIREBASE_KEY: {
        APIKEY: string,
        AUTHDOMAIN: string,
        DATABASEURL: string,
        PROJECTID: string,
        STORAGEBUCKET: string,
        MESSAGINGSENDERID: string,
    } = ConfigPrivateKeys.FIREBASE_KEY;
    
    static MONGODB_KEY: {
        USERNAME: string,
        PASSWORD: string,
        CLUSTERNAME: string,
        CONNSTRING: string
    } = ConfigPrivateKeys.MONGO_ATLAS_KEY;

    static DATABASE = {
        NAME: 'EZ.TENSORFLOW-DEV',
        TABLES: {
            MODEL: 'monica',
            USER: 'user',
            TASK: 'task',
        }
    }
}
