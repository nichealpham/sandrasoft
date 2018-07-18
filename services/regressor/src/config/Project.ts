export interface IProject {
    PROJECT_NAME: string;
    SERVICE: {
        STAGE: string;
        RUNTIME: string;
        BASE_URL: string;
    };
    AWS_CONFIG: {
        NAME: string;
        REGION: string;
    };
}

export class Project implements IProject{
    PROJECT_NAME: 'ezTensorflow';
    SERVICE: {
        STAGE: 'dev';
        RUNTIME: 'nodejs6.10';
        BASE_URL: 'https://57qqssy750.execute-api.ap-southeast-1.amazonaws.com';
    };
    AWS_CONFIG: {
        NAME: 'aws';
        REGION: 'ap-southeast-1';
    };
}
