import { ServiceConfig } from './../../../system/Config';

let UserSchema = {
    collectionName: ServiceConfig.DATABASE.TABLES.USER,
    schemaDefinition: {
        userName: {
            type: String,
            required: true,
            maxlength: 24,
            minlength: 2
        },
        email: {
            type: String,
            unique: true,
            required: true,
            maxlength: 24,
            minlength: 8,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        accessToken: String,
    }
}

Object.seal(UserSchema);
export default UserSchema;