import { ServiceLoader } from '../src/system/ServiceLoader';
import { ConsoleColor } from '../src/application/models/common/ConsoleColor';
import { DatabaseEngines } from '../src/system/DatabaseEngines';

DatabaseEngines.initialize();

let _id: string;
let _index: number = 1;

async function main() {
    await testCreateModel();
    await testUpdateModel();
    await testGetModel();
    // await testDeleteModel();

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
    let result = await ServiceLoader.modelService.createModel(event.body.data);
    _id = result._id!;
    writeScreenLog('testCreateModel', result);
}

async function testUpdateModel() {
    let event: any = {
        headers: {
            API_KEY: 123
        },
        body: {
            "data": {
                "loss": 1000,
                "name": "Model uupdated !!!!",
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
    let result = await ServiceLoader.modelService.updateModel(_id, event.body.data);
    writeScreenLog('testUpdateModel', result);
}

async function testGetModel() {
    let result = await ServiceLoader.modelService.getModel(_id);
    writeScreenLog('testGetModel', result);
}

async function testDeleteModel() {
    let result = await ServiceLoader.modelService.deleteModel(_id);
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
