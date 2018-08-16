import { Schema } from 'mongoose';
import UserSchema from './UserSchema';

let Schemas: any = {};

Schemas[`${UserSchema.collectionName}`] = new Schema(UserSchema.schemaDefinition);
Object.seal(Schema);
export default Schema;