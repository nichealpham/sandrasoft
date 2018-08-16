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
        apiKey: "AIzaSyABK7xdi-E_GVA005H7Q4NczGVUW_oiUQY",
        authDomain: "monica-service.firebaseapp.com",
        databaseURL: "https://monica-service.firebaseio.com",
        projectId: "monica-service",
        storageBucket: "",
        messagingSenderId: "104815442198",
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
