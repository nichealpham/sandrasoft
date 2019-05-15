import { MongoCollection } from './mongo_collection';
import { MongoDbConfig } from './interfaces/db_config';
import { MongoUltility } from './mongo_ultility';
declare class MongoDb {
    static connect(config: MongoDbConfig): MongoCollection;
    private static findCollection;
    private static findConnection;
    private static initCollection;
    private static initConnection;
}
export { MongoDbConfig, MongoCollection, MongoUltility, MongoDb, };
