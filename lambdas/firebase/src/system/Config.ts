export class ServiceConfig {
    static NAME = 'Simple Tensorflow.js Micro-Serverless Service';
    static EXPRESS_PORT = 2002;
    static STAGE = 'dev';
    
    static CLOUD_PROVIDER = {
        name: 'Amazon Web Services',
        service: 'AWS Lambda',
        runtime: 'nodejs8.10',
        region: 'ap-southeast-1',
        memorysize: 1024,
        timeout: 300,
    };

    static FIREBASE_KEY = {
        databaseURL: "https://sandrasofttensorflowservice.firebaseio.com",
    };

    static DATABASE = {
        NAME: 'EZTENSORFLOWSERVICES-DEV',
        COLLECTION: {
            MODEL: 'Model',
            USER: 'User',
            TASK: 'TaskWorker',
        }
    };
}
