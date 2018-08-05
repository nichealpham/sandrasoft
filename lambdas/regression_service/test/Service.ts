import {ServiceLoader} from '../src/system/ServiceLoader';
import {ConsoleColor} from '../src/application/models/common/ConsoleColor';

ServiceLoader.startServices();

let _id: string;
let _index: number = 1;

async function main() {
    await testCreateModel();
    await testGetModel();
    await testDeleteModel();
    await testTrainLinearRegressionModel();
};
main();

async function testCreateModel() {
    let event: any = {
        headers: {
            API_KEY: 123
        },
        body: {
            "data": {"loss":0.030236996710300446,"data":{"weights":{"0":-0.8055496215820312,"1":0.5777531862258911,"2":-0.1316557377576828,"3":0.5114028453826904},"bias":0.6095537543296814,"nFeatures":4},"config":{"epochs":1,"iterations":50,"shuffle":true,"optimizer":"sgd","normalize":true,"learningRate":0.009},"executionTime":0.13}
        }
    };
    let result = await ServiceLoader.LinearRegressionService.createModel(event.body.data);
    writeScreenLog('testCreateModel', result);

    _id = result._id!;
}

async function testGetModel() {
    let result = await ServiceLoader.LinearRegressionService.getModel(_id);
    writeScreenLog('testGetModel', result);
}

async function testDeleteModel() {
    let result = await ServiceLoader.LinearRegressionService.deleteModel(_id);
    writeScreenLog('testDeleteModel', result);
}

async function testTrainLinearRegressionModel() {
    let event: any = {
        body: {
            "fileUrl": "https://raw.githubusercontent.com/eliben/deep-learning-samples/master/linear-regression/CCPP-dataset/data.csv",
            "config": {
                "iterations": 1000,
                "shuffle": true,
                "normalize": true,
                "learningRate": 0.009,
                "indexLabel": 4,
                "indexFeatures": [0, 1, 2, 3]
            }
        },
        headers: {
            API_KEY: 123
        }
    }
    let result = await ServiceLoader.LinearRegressionService.trainModelFromCsv(event.body);
    writeScreenLog('testTrainLinearRegressionModel', result);
};

function writeScreenLog(testName, result) {
    if (!result) {
        console.log(ConsoleColor.Red, `\n ${_index++}. ${testName} failed.`);
        return;
    }
    console.log(ConsoleColor.Green, `\n ${_index++}. ${testName} successful.`);
    console.log(ConsoleColor.Cyan, `\n Result => ${JSON.stringify(result)}`);
}
