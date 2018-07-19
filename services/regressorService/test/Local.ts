import {LinearRegressorService} from '../src/script/tfjs-ml/LinearRegressor';
import {ConsoleColor} from '../src/model/common/ConsoleColor';

async function testTrainLinearModelFromCSV () {
    let fileUrl = 'https://raw.githubusercontent.com/eliben/deep-learning-samples/master/linear-regression/CCPP-dataset/data.csv';
    let config: any = {
        trials: 50000,
        shuffle: true,
        normalize: true,
        learningRate: 0.004,
        indexLabel: 4,
        indexFeatures: [0, 1, 2, 3],
    };
    let apiKey = 65532;
    let option = {config, fileUrl};
    let result = await LinearRegressorService.trainFromCSV(apiKey, option);
    if (result && result.loss && result.model && result.model.weights && result.model.bias)
        console.log(ConsoleColor.Green, '1. testTrainLinearModelFromCSV successful. \n');
    else
        console.log(ConsoleColor.Red, '1. testTrainLinearModelFromCSV failed. \n');
    
    // TEST VIA WEB SOCKET
    // let apiKey = 65532;
    // let option = {config, fileUrl};
    // let result = LinearRegressorService.trainFromCSV(apiKey, option);
    // let timeout = setTimeout(() => {
    //     let wsClient = new WebSocket(`http://localhost:${apiKey}`);
    //     wsClient.on('message', (message) => {
    //         console.log(message.data);
    //     });
    // }, 1000);
};
async function main() {
    await testTrainLinearModelFromCSV();
};
main();
