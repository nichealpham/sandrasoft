import {LinearRegressorService} from '../src/script/tfjs-ml/LinearRegressor';
import {ConsoleColor} from '../src/model/common/ConsoleColor';

async function testTrainLinearModelFromCSV () {
    let fileUrl = 'https://raw.githubusercontent.com/ageron/handson-ml/master/datasets/housing/housing.csv';
    let config: any = {
        trials: 200,
        shuffle: true,
        learningRate: 0.004,
    }
    let result = await LinearRegressorService.trainFromCSV(fileUrl, config);
    if (result && result.loss && result.weights && result.bias)
        console.log(ConsoleColor.Green, '1. testTrainLinearModelFromCSV successful.');
    else
        console.log(ConsoleColor.Red, '1. testTrainLinearModelFromCSV failed.');
};
async function main() {
    await testTrainLinearModelFromCSV();
};
main();
