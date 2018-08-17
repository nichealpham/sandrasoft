import * as mongoose from 'mongoose';
import MlabConfig from './MongoosePrivateKeys';

let ConnectionString1 = `mongodb://${MlabConfig.USERNAME}:${MlabConfig.PASSWORD}@${MlabConfig.DBDOMAIN}/${MlabConfig.DBNAME}`;

export class MongooseApp {
    static async initialize() {
        await this.initConnection();
    }

    static async initConnection() {
        return new Promise<boolean>((resolve, reject) => {
            mongoose.connect(ConnectionString1);
            let connection = mongoose.connection;
            connection.on('error', (error) => {
                reject(error);
            });
            connection.once('open', () => {
	            console.log("\x1b[36m", '\n Mongoose Connection Established Successfully !');
                resolve(true);
            });
        });
    }
}