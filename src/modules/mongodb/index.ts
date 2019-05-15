// Import external-modules
import * as Mongoose from 'mongoose';

// Import peer-modules
import { Logger } from '../logger';
// Import sub-modules
import { MongoCollection } from './mongo_collection';
import { IMongoDbConfig } from './interfaces/db_config';
import { MongoUltility } from './mongo_ultility';

// Define gobal variables
const connections: {[cnnSecreteKey: string]: Mongoose.Connection} = {};
const collections: {[colSecreteKey: string]: MongoCollection} = {};

class MongoDb {
    public static connect(config: IMongoDbConfig): MongoCollection {
        let collection = this.findCollection(config);
        if (!collection) {
            let connection = this.findConnection(config);
            if (!connection) {
                connection = this.initConnection(config);
            }
            collection = this.initCollection(connection, config);
        }
        return collection;
    }

    private static findCollection(config: IMongoDbConfig): MongoCollection {
        let secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}/${config.modelname}`;
        return collections[secreteKey];
    }

    private static findConnection(config: IMongoDbConfig): Mongoose.Connection {
        let secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}`;
        return connections[secreteKey];
    }

    private static initCollection(connection: Mongoose.Connection, config: IMongoDbConfig): MongoCollection {
        let secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}/${config.modelname}`;
        let collection = new MongoCollection(connection, config.modelname, config.schema);
        collections[secreteKey] = collection;
        return collection;
    }

    private static initConnection(config: IMongoDbConfig): Mongoose.Connection {
        let secreteKey = `mongodb://${config.username}:${config.password}@${config.hostname}/${config.dbname}`;
        let connection = Mongoose.createConnection(secreteKey, { 
            useNewUrlParser: true,
            useCreateIndex: true,
        });
        connection.on('error', (error) => {
            Logger.error(`Mongoose Connection Error!`);
            Logger.error(`Message: ${error.toString()} !`);
        });
        connection.once('open', () => {
            connection[secreteKey] = connection;
            Logger.info(`Mongoose Connection Success, db: ${config.dbname}`);
        });
        return connection;
    }
}

export {
    IMongoDbConfig,
    MongoCollection,
    MongoUltility,
    MongoDb,
}





