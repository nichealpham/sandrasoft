export interface IProject {
    PROJECT_NAME: string,
    SERVICE: {
        STAGE: string,
        RUNTIME: string,
        BASE_URL: string,
    },
    AWS_CONFIG: {
        NAME: string,
        REGION: string,
    },
}

export class Project {
    static PROJECT_NAME = 'ezTensorflow';
    static SERVICE = {
        STAGE: 'dev',
        RUNTIME: 'nodejs8.10',
        BASE_URL: 'https://70jfbnsgr5.execute-api.ap-southeast-1.amazonaws.com',
    };
    static AWS_CONFIG = {
        NAME: 'aws',
        REGION: 'ap-southeast-1',
    };
}
