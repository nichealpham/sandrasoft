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

    static FIREBASE = {
        apiKey: "AIzaSyABK7xdi-E_GVA005H7Q4NczGVUW_oiUQY",
        authDomain: "monica-service.firebaseapp.com",
        databaseURL: "https://monica-service.firebaseio.com",
        projectId: "monica-service",
        storageBucket: "",
        messagingSenderId: "104815442198",
    };
}
