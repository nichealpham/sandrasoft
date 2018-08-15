import { ServiceConfig } from './../../system/Config';
import * as mongoose from 'mongoose';
export class MongooseApp {
    static mongoose;
    static async initialize() {
        await this.connectDB(ServiceConfig.MONGO_MLAB_KEY.CONNSTRING);
    }

    static async connectDB(uri: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let setting = {

            }
            mongoose.connect(uri, setting);
            let connection = mongoose.connection;
            connection.on('error', (error) => {
                reject(error);
            });
            connection.once('open', () => {
                this.mongoose = mongoose;
                resolve(true);
            });
        });
    }

    static initSchemas(schemas: mongoose.SchemaDefinition[]) {
        for (let i = 0; i < schemas.length; i++) {

        }
    }
}