import {Greeting} from './src/script/starter/Greeting';
import {HandlerHelper} from './src/script/helper/HandlerHelper';

export async function hello (event, context, callback) {
    let greeting = new Greeting('Welcome to ezTensorflow Service !!!');
    let response = HandlerHelper.createSuccessResponse(200, null, greeting.message);
    callback(null, response);
};
