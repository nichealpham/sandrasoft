import * as timer from 'node-simple-timer';
import {DataHelper} from '../models/helper/DataHelper';
import {LinearRegressor} from '../models/regression/LinearRegressor';

export class LinearRegressionService {
    static async trainModelFromCsv(input: {fileUrl, config}) {
        let totalTimer = new timer.Timer();
        totalTimer.start();
        // Initiate variables
        let labels_data: any[] = [];
        let features_data: any[] = [];
        // STEP 1: READ FILE FROM URL TO RAM
        let data = await DataHelper.readCsvFromUrl(input.fileUrl);
        if (!input.config) {
            input.config = {};
        };
        if (!input.config.indexFeatures || !input.config.indexLabel) {
            let firstRow = data[0];
            let indexFeatures:  number[] = [];
            input.config.indexLabel = firstRow.length - 1;
            for (let i = 0; i < firstRow.length - 1; i++) {
                indexFeatures.push(i);
            };
            input.config.indexFeatures = indexFeatures;
        }
        data.forEach(row => {
            if (!row || !row.length || !row[0])
                return;
            else {
                let feature_row: any[] = [];
                input.config!.indexFeatures!.forEach(index => {
                    feature_row.push(row[index])
                });
                features_data.push(feature_row);
                labels_data.push(row[input.config!.indexLabel!]);
            }
        });
        // STEP 2: NORMALIZE DATASET
        if (input.config.normalize) {
            let {features, labels} = DataHelper.normalizeDataset(features_data, labels_data);
            features_data = features;
            labels_data = labels;
        }
        // // STEP 3: CREATE A LINEAR REGRESSION MODEL
        // let model = new LinearRegressor(input.config);
        // // STEP 4: TRAIN THE MODEL
        // await model.train(features_data, labels_data, (i, cost) => {
        //     if (i % Math.floor(input.config!.trials! / 100) === 0)
        //         console.log(`Epoch ${i} loss is: ${cost}`);
        // });
        totalTimer.end();
        // STEP 5: RETURN CUSTOMIZED VALUES
        return {
            // model: {
            //     weights: model.weights.dataSync(),
            //     bias: model.bias.dataSync(),
            //     config: model.config,
            //     loss: model.loss,
            //     nSamples: model.nSamples,
            //     nFeatures: model.nFeatures,
            // },
            executionTime: `${totalTimer.seconds().toFixed(2)}s`
        };;
    }
}