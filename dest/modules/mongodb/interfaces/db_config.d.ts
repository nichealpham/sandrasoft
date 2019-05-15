import { Schema } from 'mongoose';
export interface MongoDbConfig {
    username: string;
    password: string;
    hostname: string;
    dbname: string;
    modelname: string;
    schema: Schema;
}
