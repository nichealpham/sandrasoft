import {LinearRegressorService} from '../src/script/tfjs-ml/LinearRegressor';
import {ConsoleColor} from '../src/model/common/ConsoleColor';

async function testTrainLinearModelFromCSV () {
    let input = {
        fileUrl: 'https://raw.githubusercontent.com/eliben/deep-learning-samples/master/linear-regression/CCPP-dataset/data.csv',
        config: {
            trials: 100000,
            shuffle: true,
            normalize: true,
            learningRate: 0.009,
            indexLabel: 4,
            indexFeatures: [0, 1, 2, 3],
        }
    }
    
    // let apiKey = 'CUSTOMIZED_API_KEY';
    let result = await LinearRegressorService.trainFromCSV(input);

    if (!result || !result.model) {
        console.log(ConsoleColor.Red, '1. testTrainLinearModelFromCSV failed. \n');
        return;
    }
    console.log(ConsoleColor.Cyan, `Result ${JSON.stringify(result)} \n`);
    console.log(ConsoleColor.Green, '1. testTrainLinearModelFromCSV successful. \n');
};
async function main() {
    await testTrainLinearModelFromCSV();
};
main();
