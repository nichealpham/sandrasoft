import {exec} from 'child_process';
import {ConsoleColor} from '../src/model/common/ConsoleColor';

async function testTrainLinearModelFromCSV () {
    exec(`curl  
        --header 'Content-Type: application/json' \
        --request POST \
        --data '{"file_url":"https://raw.githubusercontent.com/ageron/handson-ml/master/datasets/housing/housing.csv"}' \
        https://70jfbnsgr5.execute-api.ap-southeast-1.amazonaws.com/dev/services/regressor/train-linear-model`, 
        
        async (err, stdout, stderr) => {
            if (err && stderr) {
                console.log(ConsoleColor.Red, '1. testTrainLinearModelFromCSV failed.');
                return;
            }
            console.log(ConsoleColor.Green, '1. testTrainLinearModelFromCSV successful.');
            console.log(`stdout: ${stdout}`);
        }
    );
};
async function main() {
    await testTrainLinearModelFromCSV();
};
main();