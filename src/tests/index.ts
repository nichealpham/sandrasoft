import {RegressorService} from '../app/services/RegressorService';
import {exec} from 'child_process';

async function testTrainLinearModelFromCSV () {
    let fileUrl = 'https://raw.githubusercontent.com/ageron/handson-ml/master/datasets/housing/housing.csv';
    let config = {
        trials: 200,
        shuffle: true,
        learningRate: 0.004,
    }
    let result = await RegressorService.LinearModel.trainFromCSV(fileUrl, config);
    console.log(result);

    exec("curl  --header 'Content-Type: application/json' \
                --request POST \
                --data '{\
                    'file_url':'https://raw.githubusercontent.com/ageron/handson-ml/master/datasets/housing/housing.csv'\
                }' \
                https://efighk3iwf.execute-api.ap-southeast-1.amazonaws.com/dev/services/regressor/train-linear-from-csv", 
        async (err, stdout, stderr) => {
        if (err) {
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
};
testTrainLinearModelFromCSV();
