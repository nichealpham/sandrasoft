// Import external-modules
import { Schema } from 'mongoose';

export interface IMongoDbConfig {
    username: string,
    password: string,
    hostname: string,
    dbname: string,
    modelname: string,
    schema: Schema,
}