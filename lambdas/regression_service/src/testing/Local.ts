import {LinearRegressionService} from '../app/views/LinearRegressionService'
import {ConsoleColor} from '../app/models/common/ConsoleColor';

async function testTrainLinearRegressionModel () {
    let input = {
        fileUrl: 'https://raw.githubusercontent.com/eliben/deep-learning-samples/master/linear-regression/CCPP-dataset/data.csv',
        config: {
            trials: 1000,
            shuffle: true,
            normalize: true,
            learningRate: 0.009,
            indexLabel: 4,
            indexFeatures: [0, 1, 2, 3],
        }
    }
    let result = await LinearRegressionService.trainModelFromCsv(input);
    if (!result) {
        console.log(ConsoleColor.Red, '1. testTrainLinearRegressionModel failed. \n');
        return;
    }
    console.log(ConsoleColor.Cyan, `Result ${JSON.stringify(result)} \n`);
    console.log(ConsoleColor.Green, '1. testTrainLinearRegressionModel successful. \n');
};
async function main() {
    await testTrainLinearRegressionModel();
};
main();
