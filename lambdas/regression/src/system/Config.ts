export class ServiceConfig {
    static NAME = 'Simple Tensorflow.js Micro-Serverless Service';
    static EXPRESS_PORT = 2001;
    static STAGE = 'dev';
    
    static CLOUD_PROVIDER = {
        name: 'Amazon Web Services',
        service: 'AWS Lambda',
        runtime: 'nodejs8.10',
        region: 'ap-southeast-1',
        memorysize: 1024,
        timeout: 300,
    };

    static DATABASE = {
        NAME: 'EZTENSORFLOWSERVICES-DEV',
        COLLECTION: {
            MODEL: 'monica',
            USER: 'user',
            TASK: 'task',
        }
    };
}
