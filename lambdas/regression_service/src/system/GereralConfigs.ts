export class ServiceConfig {
    static NAME = 'Simple Tensorflow.js Micro-Serverless Service';
    static API_BASE = 'https://70jfbnsgr5.execute-api.ap-southeast-1.amazonaws.com';
    static STAGE = 'dev';
    
    static CLOUD_PROVIDER = {
        name: 'aws',
        runtime: 'nodejs8.10',
        region: 'ap-southeast-1',
        memorysize: 1024,
        timeout: 300,
    };

    static FIREBASE: {
        apiKey: string;
        privateKey: string;
        authDomain: string;
        databaseURL: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
    };
}
