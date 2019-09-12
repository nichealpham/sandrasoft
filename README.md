# Sandrasoft
[![Support Node of LTS](https://img.shields.io/badge/node-LTS-brightgreen.svg)](https://nodejs.org/)
[![npm version](https://badge.fury.io/js/icon-gen.svg)](https://badge.fury.io/js/icon-gen)
[![Build Status](https://travis-ci.org/akabekobeko/npm-icon-gen.svg?branch=master)](https://travis-ci.org/akabekobeko/npm-icon-gen)
[![Document](https://img.shields.io/badge/document-ESDoc-brightgreen.svg)](https://akabekobeko.github.io/npm-icon-gen/)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

A collection of Node.js ultilities for creating scalable backend services.

## Overview
This package is a summarization from my own experience working as a backend engineer during the last 3 years. It is suitable for both software and api development.

## Packages
# [1. SandraCore](https://github.com/nichealpham/sandrasoft/tree/master/src/modules/sandracore)
Write simple and single threaded RESTfull APIs with declaritive code style.

## a. Create a server instance
Create a simple **HTTP** server with just 5 lines of code:
```typescript
import { SandraCore } from "sandrasoft";
const config = {
    apiRoot: '/api',
    port: process.env.PORT,
};
const app = new SandraCore(config);
app.startListening();
```

Or create an **HTTPS** server with `useHttps` method:
```typescript
import { SandraCore } from "sandrasoft";
const config = {
    apiRoot: '/api',
    port: process.env.PORT,
    useHttps: {
        keyFilePath: './private/server.key';
        certFilePath: './private/server.crt';
        passphrase: 'sample';
    }
};
const app = new Server(config);
app.startListening();
```

## b. Apply middlewares into the instance
You can apply middlewares into sandracore instances:
```typescript
const app = new Server(config);
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.json());
app.startListening();
```

If you prefer express coding style, then do the following:
```typescript
const server = new Server(config);
const app = server.getInstance();
app.use('/', express.static(path.join(process.cwd(), 'public')));
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');
server.startListening();
```

By default, the [following middlewares](https://ghe.corp.yahoo.co.jp/gyao/gyaosoft/blob/master/src/server/index.ts#L35-L38) are automatically added when new sandracore instance is created:
1. [cookieParser](https://www.npmjs.com/package/cookie-parser)
2. [cors](https://www.npmjs.com/package/cors)
3. [bodyParser.json](https://www.npmjs.com/package/body-parser)
4. [bodyParser.urlencoded](https://www.npmjs.com/package/body-parser)

## c. Write declarity APIs
Create a RESTfull API endpoint with this code style:
```typescript
const UserLoginRouter = {
    method: 'POST',
    paths: ['/user/login'], 
    validations: {
        body: {
            email: ['isEmail'],
            password: ['!isEmpty'],
        },
    },
    middlewares: [],
    controller: async (req: Request) => {
        const {email, password} = req.body;
        return await UserService.login(email, password);
    }
}
app.applyRoutes({ UserLoginRouter });
```

Supported functions for validations: see [`validator.js`](https://www.npmjs.com/package/validator)

⚠️ **Important Note**:

The current version of `sandrasoft` only supports validator functions whose accept **only 1 param**.

For example: `isEmail(str)` is supported while `equals(str, comparison)` does not.

Pull request for this feature is pretty much welcomed 💪

## d. Apply specific midlewares to a router
Middlewares that are specific to a router can be applied by the following:
```typescript
import * as multer from "multer";

const UpdateAvatarRouter = {
    method: 'POST',
    paths: ['/user/avatar'], 
    middlewares: [
        /* this middleware looks for authorization token in headers */
        (req: Request, res: Response, next: NextFunction) => {
            if (!req.headers['authorization']) {
                next(new Error('User not logged in'))
            }
            next();
        },
        /* this middleware uses multer library to handle file upload */
        multer({ storage: multer.memoryStorage() }).single('fileUpload');
    ],
    controller: async (req: Request) => {
        /* do something with req.file, given by multer */
    }
}
app.applyRoutes({ UpdateAvatarRouter });
```

## e. Result return from server
Success response schema
```json
{
    "statusCode": 200,
    "data": "Success reponse can be type of any"
}
```

Error response schema
```json
{
    "statusCode": 500,
    "error": "Error message returned from router's controller or middlewares"
}
```

[2. MongoDb](https://github.com/nichealpham/sandrasoft/tree/master/src/modules/mongodb)

Documentation comming soon...

[3. Google Storage](https://github.com/nichealpham/sandrasoft/tree/master/src/modules/google-storage)

Documentation comming soon...

