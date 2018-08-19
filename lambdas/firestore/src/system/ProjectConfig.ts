export class ProjectConfig {
    static NAME = 'FirestoreService.Sandrasoft';
    static API_BASE = 'https://0rri7wpdpi.execute-api.ap-southeast-1.amazonaws.com';
    static STAGE = 'dev';
    static ENGINE = 'lambda';
    static ALIAS = 'firestore';
    static DEV_PORT = 2002;
    
    static CLOUD_PROVIDER = {
        name: 'Amazon Web Services',
        runtime: 'nodejs8.10',
        region: 'ap-southeast-1',
        memorysize: 1024,
        timeout: 300,
    };

    static APIS = [
        'GET://model/get/:_id',
        'POST://model/create',
        'PUT://model/update/:_id',
        'DELETE://model/delete/:_id',
    ];

    static COLLECTIONS = {
        MODEL: 'Model'
    }
}
