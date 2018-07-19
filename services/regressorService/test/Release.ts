import {exec} from 'child_process';
import {Project} from '../src/config/Project';
import {ConsoleColor} from '../src/model/common/ConsoleColor';

async function testTrainLinearModelFromCSV () {
    let apiUrl = `${Project.SERVICE.BASE_URL}/${Project.SERVICE.STAGE}/services/regressor/train-linear-model`;
    exec(`curl -X POST ${apiUrl} \
            -d '{ \
                "file_url": "https://raw.githubusercontent.com/eliben/deep-learning-samples/master/linear-regression/CCPP-dataset/data.csv", \
	            "config": { \
                    "trials": 100, \
                    "shuffle": true, \
                    "normalize": true, \
                    "learningRate": 0.004, \
                    "indexLabel": 4, \
                    "indexFeatures": [0, 1, 2, 3] \
                } \
            }' --progress-bar`, 
        async (err, stdout, stderr) => {
            if (err && stderr) {
                console.log(ConsoleColor.Red, '1. testTrainLinearModelFromCSV failed.');
                return;
            }
            console.log(ConsoleColor.Cyan, `Response: ${stdout} \n`);
            console.log(ConsoleColor.Green, '1. testTrainLinearModelFromCSV successful. \n');
        }
    );
};
async function main() {
    await testTrainLinearModelFromCSV();
};
main();