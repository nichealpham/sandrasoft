import {exec} from 'child_process';
import {ConsoleColor} from '../src/model/common/ConsoleColor';

async function testGreeting () {
    exec(`curl  
        --request GET \
        https://efighk3iwf.execute-api.ap-southeast-1.amazonaws.com/dev/service/greeting/hello`, 
        
        async (err, stdout, stderr) => {
            if (err || stderr) {
                console.log(ConsoleColor.Red, '1. testGreeting failed.');
                return;
            }
            console.log(ConsoleColor.Green, '1. testGreeting successful.');
            console.log(ConsoleColor.White, `stdout: ${stdout}`);
        }
    );
};
async function main() {
    await testGreeting();
};
main();