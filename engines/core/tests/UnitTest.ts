import { DatabaseEngines } from './../src/system/DatabaseEngines';
import { ServiceGateway } from '../src/system/ServiceGateway';
import { ConsoleColor } from '../src/application/models/common/ConsoleColor';

async function setup() {
    await DatabaseEngines.initialize();
}

let _id: string;
let _index: number = 1;

async function main() {
    await setup();
    await testCreateModel();
    await testGetModel();
    await testTrainModel();
    await testTrainModelAgain();
    await testDeleteModel();

    console.log(ConsoleColor.White, `\n All test cases finised successfully ! \n`);
};
main();

async function testCreateModel() {
    let event: any = {
        headers: {
            API_KEY: 123
        },
        body: {
            "data": {
                "loss": 0,
                "name": "Model testing ...",
                "type": 2,
                "createdAt": new Date().getTime(),
                "updatedAt": new Date().getTime(),
                "executionTime": 0,
                "config": {
                    "iterations": 0,
                    "shuffle": true,
                    "normalize": true,
                    "learningRate": 0.01,
                },
            }
        }
    };
    let result = await ServiceGateway.LinearRegressionService.createModel(event.body.data);
    writeScreenLog('testCreateModel', result);

    _id = result._id!;
}

async function testGetModel() {
    let result = await ServiceGateway.LinearRegressionService.getModel(_id);
    writeScreenLog('testGetModel', result);
}

async function testTrainModel() {
    let event: any = {
        body: {
            "fileUrl": "https://raw.githubusercontent.com/eliben/deep-learning-samples/master/linear-regression/CCPP-dataset/data.csv",
            "config": {
                "iterations": 1000,
                "learningRate": 0.01,
                "indexLabel": 4,
                "indexFeatures": [0, 1, 2, 3]
            },
            "modelId": _id
        }
    }
    let result = await ServiceGateway.LinearRegressionService.trainModelFromCsv(event.body);
    writeScreenLog('testTrainModel', result);
};

async function testTrainModelAgain() {
    let event: any = {
        body: {
            "fileUrl": "https://raw.githubusercontent.com/eliben/deep-learning-samples/master/linear-regression/CCPP-dataset/data.csv",
            "config": {
                "iterations": 5000,
                "learningRate": 0.1,
                "indexLabel": 4,
                "indexFeatures": [0, 1, 2, 3]
            },
            "modelId": _id
        }
    }
    let result = await ServiceGateway.LinearRegressionService.trainModelFromCsv(event.body);
    writeScreenLog('testTrainModelAgain', result);
};

async function testDeleteModel() {
    let result = await ServiceGateway.LinearRegressionService.deleteModel(_id);
    writeScreenLog('testDeleteModel', result);
}

function writeScreenLog(testName, result) {
    if (!result) {
        console.log(ConsoleColor.Red, `\n ${_index++}. ${testName} failed.`);
        return;
    }
    console.log(ConsoleColor.Green, `\n ${_index++}. ${testName} successful.`);
    console.log(ConsoleColor.Cyan, `\n Result => ${JSON.stringify(result)}`);
}
