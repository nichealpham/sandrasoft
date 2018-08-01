import {LinearRegressionService} from '../app/views/LinearRegressionService'
import {ConsoleColor} from '../app/models/common/ConsoleColor';
import {Middleware} from '../system/Middleware';

async function main() {
    await testCreateModel();
    await testTrainLinearRegressionModel();
};
main();

async function testCreateModel() {
    let event: any = {
        headers: {
            API_KEY: 123
        },
        body: JSON.stringify({
            "data": {"loss":0.030236996710300446,"data":{"weights":{"0":-0.8055496215820312,"1":0.5777531862258911,"2":-0.1316557377576828,"3":0.5114028453826904},"bias":0.6095537543296814,"nFeatures":4},"config":{"epochs":1,"iterations":50,"shuffle":true,"optimizer":"sgd","normalize":true,"learningRate":0.009},"executionTime":0.13}
        })
    };
    let params = {
        headers: ['API_KEY'],
        body: ['data'],
    };
    let {status, response} = Middleware.ensureExist(event, params);
    if (!status) {
        console.log(ConsoleColor.Red, `Response: ${JSON.stringify(response)} \n`);
        console.log(ConsoleColor.Red, '1. testTrainLinearRegressionModel failed. Middleware Validation failed ! \n');
        return;
    }
    if (status)
        console.log(ConsoleColor.Green, `Response: ${JSON.stringify(response)} \n`);

    let result = await LinearRegressionService.createMonica(event.body.data);
    if (!result) {
        console.log(ConsoleColor.Red, '2. testCreateModel failed. \n');
        return;
    }
    console.log(ConsoleColor.Cyan, `Result ${JSON.stringify(result)} \n`);
    console.log(ConsoleColor.Green, '2. testCreateModel successful. \n');
}

async function testTrainLinearRegressionModel() {
    let event: any = {
        body: JSON.stringify({
            "fileUrl": "https://raw.githubusercontent.com/eliben/deep-learning-samples/master/linear-regression/CCPP-dataset/data.csv",
            "config": {
                "trials": 1000,
                "shuffle": true,
                "normalize": true,
                "learningRate": 0.009,
                "indexLabel": 4,
                "indexFeatures": [0, 1, 2, 3]
            }
        }),
        headers: {
            API_KEY: 123
        }
    }
    let params = {
        body: ['fileUrl', 'config'],
        headers: ['API_KEY']
    };
    let {status, response} = Middleware.ensureExist(event, params);
    if (!status) {
        console.log(ConsoleColor.Red, `Response: ${JSON.stringify(response)} \n`);
        console.log(ConsoleColor.Red, '1. testTrainLinearRegressionModel failed. Middleware Validation failed ! \n');
        return;
    }
    if (status)
        console.log(ConsoleColor.Green, `Response: ${JSON.stringify(response)} \n`);
    let result = await LinearRegressionService.trainMonicaFromCsv(event.body);
    if (!result) {
        console.log(ConsoleColor.Red, '1. testTrainLinearRegressionModel failed. \n');
        return;
    }
    console.log(ConsoleColor.Cyan, `Result ${JSON.stringify(result)} \n`);
    console.log(ConsoleColor.Green, '1. testTrainLinearRegressionModel successful. \n');
};
