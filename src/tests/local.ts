import {RegressorService} from '../app/services/RegressorService';
import {ConsoleColor} from '../app/model/common/ConsoleColor';

async function testTrainLinearModelFromCSV () {
    let fileUrl = 'https://raw.githubusercontent.com/ageron/handson-ml/master/datasets/housing/housing.csv';
    let config = {
        trials: 200,
        shuffle: true,
        learningRate: 0.004,
    }
    let result = await RegressorService.LinearModel.trainFromCSV(fileUrl, config);
    if (result && result.loss && result.weights && result.bias)
        console.log(ConsoleColor.Green, '1. testTrainLinearModelFromCSV successful.');
    else
        console.log(ConsoleColor.Red, '1. testTrainLinearModelFromCSV failed.');
};
async function main() {
    await testTrainLinearModelFromCSV();
};
main();
