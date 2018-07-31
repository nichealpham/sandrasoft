export class ServiceConfig {
    static NAME = 'Simple Tensorflow.js Micro-Serverless Service';
    static API_BASE: 'https://70jfbnsgr5.execute-api.ap-southeast-1.amazonaws.com';
    static STAGE: 'dev';
    static PROVIDER: {
        NAME: 'aws',
        RUNTIME: 'nodejs8.10',
        REGION: 'ap-southeast-1',
        MEMORYSIZE: 1024,
        TIMEOUT: 300,
    };
}
