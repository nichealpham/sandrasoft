import {exec} from 'child_process';
import {ConsoleColor} from '../app/model/common/ConsoleColor';

async function testTrainLinearModelFromCSV () {
    exec(`curl  
        --header 'Content-Type: application/json' \
        --request POST \
        --data '{'file_url':'https://raw.githubusercontent.com/ageron/handson-ml/master/datasets/housing/housing.csv'}' \
        https://efighk3iwf.execute-api.ap-southeast-1.amazonaws.com/dev/service/regressor/train-linear-from-csv`, 
        
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