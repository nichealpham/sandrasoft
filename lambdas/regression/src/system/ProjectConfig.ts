export class ProjectConfig {
    static NAME = 'TensorflowService.Regression.Sandrasoft';
    static API_BASE = 'https://v6hy1s0o82.execute-api.ap-southeast-1.amazonaws.com';
    static STAGE = 'dev';
    static ENGINE = 'lambda';
    static ALIAS = 'regression';
    static DEV_PORT = 2001;
    
    static CLOUD_PROVIDER = {
        name: 'Amazon Web Services',
        runtime: 'nodejs8.10',
        region: 'ap-southeast-1',
        memorysize: 1024,
        timeout: 300,
    };

    static APIS = [
        'GET://linear/get-model/:_id',
        'POST://linear/train-model/:_id',
        'POST://linear/create-model',
        'DELETE://linear/delete-model/:_id',
    ];
}
