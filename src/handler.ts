import {Greeting} from './services/GreetingService';
import {HandlerHelper} from './system/app/helper/HandlerHelper';

export async function hello (event, context, callback) {
    let greeting = new Greeting('Welcome to my Serverless Template !!!');
    let response = HandlerHelper.createSuccessResponse(200, null, greeting.message);
    callback(null, response);
};
