import {LinearRegressorService} from '../src/script/tfjs-ml/LinearRegressor';
import {ConsoleColor} from '../src/model/common/ConsoleColor';

async function testTrainLinearModelFromCSV () {
    let fileUrl = 'https://raw.githubusercontent.com/eliben/deep-learning-samples/master/linear-regression/CCPP-dataset/data.csv';
    let config: any = {
        trials: 200,
        shuffle: true,
        normalize: true,
        learningRate: 0.004,
        indexLabel: 4,
        indexFeatures: [0, 1, 2, 3],
    }
    let result = await LinearRegressorService.trainFromCSV(fileUrl, config);
    if (result && result.loss && result.model && result.model.weights && result.model.bias)
        console.log(ConsoleColor.Green, '1. testTrainLinearModelFromCSV successful.');
    else
        console.log(ConsoleColor.Red, '1. testTrainLinearModelFromCSV failed.');
};
async function main() {
    await testTrainLinearModelFromCSV();
};
main();
