import { ConsoleColor } from './../../application/models/common/ConsoleColor';
import { ServiceConfig } from './../../system/Config';
import * as mongoose from 'mongoose';
export class MongooseApp {
    static async initialize() {
        await this.connectDB(ServiceConfig.MONGO_MLAB_KEY.CONNECTION_STRING);
    }

    static async connectDB(uri: string) {
        return new Promise<boolean>((resolve, reject) => {
            mongoose.connect(uri);
            let connection = mongoose.connection;
            connection.on('error', (error) => {
                reject(error);
            });
            connection.once('open', () => {
	            console.log(ConsoleColor.Green, '\n 1. Mongoose Engine Initilize Success');
                resolve(true);
            });
        });
    }
}