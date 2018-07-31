import {exec} from 'child_process';
import {ServiceConfig} from '../system/GereralConfigs';
import {ConsoleColor} from '../app/models/common/ConsoleColor';

async function testTrainLinearRegressionModel () {
    let apiUrl = `${ServiceConfig.API_BASE}/${ServiceConfig.STAGE}/services/regressor/train-linear-model`;
    let apiKey = 'CUSTOMIZED_API_KEY';
    exec(`curl --header "API_KEY: ${apiKey}" \
            -X POST ${apiUrl} \
            -d '{ \
                "file_url": "https://raw.githubusercontent.com/eliben/deep-learning-samples/master/linear-regression/CCPP-dataset/data.csv", \
	            "config": { \
                    "trials": 50, \
                    "shuffle": true, \
                    "normalize": true, \
                    "learningRate": 0.004, \
                    "indexLabel": 4, \
                    "indexFeatures": [0, 1, 2, 3] \
                } \
            }'`, 
        async (err, stdout, stderr) => {
            if (err && stderr) {
                console.log(ConsoleColor.Red, `Response: ${err || stderr} \n`);
                console.log(ConsoleColor.Red, '1. testTrainLinearRegressionModel failed. \n');
                return;
            }
            if (stdout && !(JSON.parse(stdout)).data) {
                console.log(ConsoleColor.Red, `Response: ${stdout} \n`);
                console.log(ConsoleColor.Red, '1. testTrainLinearRegressionModel failed. \n');
                return;
            }
            console.log(ConsoleColor.Cyan, `Response: ${stdout} \n`);
            console.log(ConsoleColor.Green, '1. testTrainLinearRegressionModel successful. \n');
        }
    );
};
async function main() {
    await testTrainLinearRegressionModel();
};
main();