import {Greeting} from '../src/script/starter/Greeting';
import {ConsoleColor} from '../src/model/common/ConsoleColor';

async function testGreeting () {
    let greeting = new Greeting('Welcome to ezTensorflow Service !!!');
    if (greeting.message === 'Welcome to ezTensorflow Service !!!')
        console.log(ConsoleColor.Green, '1. testGreeting successful.');
    else
        console.log(ConsoleColor.Red, '1. testGreeting failed.');
};
async function main() {
    await testGreeting();
};
main();

