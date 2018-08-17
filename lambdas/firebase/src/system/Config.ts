export class ServiceConfig {
    static NAME = 'Simple Tensorflow.js Micro-Serverless Service';
    static EXPRESS_PORT = 8080;
    static STAGE = 'dev';
    
    static CLOUD_PROVIDER = {
        NAME: 'Amazon Web Services',
        SERVICE: 'AWS Lambda',
        RUNTIME: 'nodejs8.10',
        REGION: 'ap-southeast-1',
        MEMORYSIZE: 1024,
        TIMEOUT: 300,
    };

    static DATABASE = {
        NAME: 'EZ.TENSORFLOW-DEV',
        COLLECTION: {
            MODEL: 'Model',
            USER: 'User',
            TASK: 'TaskWorker',
        }
    }
}
