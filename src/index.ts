import { SandraCore } from "./lib/server";
import { GoogleStorage } from "./lib/storage";
import { MongoDb } from "./lib/mongodb";
import { Logger } from "mongodb";

module.exports = {
    SandraCore: SandraCore,
    SandraStorage: GoogleStorage,
    SandraMongo: MongoDb,
    SandraLogger: Logger,
}