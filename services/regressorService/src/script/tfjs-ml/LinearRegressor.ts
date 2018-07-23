import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';
import * as timer from 'node-simple-timer';

export class LinearRegressorModelConfig {
    trials?: number;
    shuffle?: boolean;
    optimizer?: string;
    normalize?: boolean;
    learningRate?: number;
    indexLabel?: number;
    indexFeatures?: number[];
}

import * as https from 'https';
import * as parser from 'csv-parse';

// excute the service as a child-process
process.on('message', async (input) => {
    let result = await LinearRegressorService.trainFromCSV(input); 
    process.send!(result);
});

export class LinearRegressorService {
    static async trainFromCSV(input: {fileUrl: string, config?: LinearRegressorModelConfig}) {
        let totalTimer = new timer.Timer();
        totalTimer.start();
        // Initiate variables
        let labels_data: any[] = [];
        let features_data: any[] = [];
        // Read data from url
        let data = await readCsvFromUrl(input.fileUrl);
        if (!input.config) {
            input.config = {};
        }
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
        if (input.config.normalize) {
            let {features, labels} = normalizeDataset(features_data, labels_data);
            features_data = features;
            labels_data = labels;
        }
        let model = new LinearRegressorModel(input.config);
        await model.train(features_data, labels_data, (i, cost) => {
            console.log(`Epoch ${i} loss is: ${cost}`);
        });
        totalTimer.end();
        return {
            loss: model.loss,
            model: {
                weights: model.weights,
                bias: model.bias,
            },
            config: model.config,
            executionTime: `${totalTimer.seconds().toFixed(2)}s`
        };;
    }
}

export class LinearRegressorModel {
    public loss: any;
    public bias: any;
    public config: any;
    public weights: any;

    constructor(config?: LinearRegressorModelConfig) {
        this.config = {
            trials: 50, 
            shuffle: true, 
            optimizer: 'sgd',
            normalize: false, 
            learningRate: 0.005
        };
        if (config)
            this.config = {...this.config, ...config};
    }

    async train(xs: number[][], ys: number[], epochsSuccessCallback?: any): Promise<void> {
        let nSamples = ys.length;
        let nFeatures = xs[0].length;
        // Prepare data
        let Y = tf.tensor(ys).reshape([nSamples, 1]);
        let X = tf.tensor(xs).reshape([nSamples, nFeatures]);
        // Prepare weights and bias
        let weights = tf.variable(tf.randomNormal([1, nFeatures]));
        let bias = tf.variable(tf.randomNormal([1, nFeatures]));

        let optimizer = tf.train[this.config.optimizer!](this.config.learningRate);
        for (let i = 0; i < this.config.trials!; i++) {
            optimizer.minimize(() => {
                let loss = cost(predict(X, weights, bias), Y);
                if (epochsSuccessCallback)
                    epochsSuccessCallback(i, loss.dataSync()[0]);
                this.loss = loss.dataSync()[0];
                return loss;
            });
        };
        this.weights = weights.dataSync();
        this.bias = bias.dataSync();
    }

    predict(xs: number[][]) {
        return predict(tf.tensor(xs).reshape([xs.length, xs[0].length]), this.weights, this.bias);
    }

    reConfig(config) {
        this.config = {...this.config, ...config};
    }
}

function predict(X: tf.Tensor, weights: tf.Variable, bias: tf.Variable): tf.Tensor {
    // return X . weights + bias
    return tf.tidy(() => {
        return X.mul(weights).add(bias).dot(tf.fill([weights.dataSync().length, 1], 1));
    });
}

function cost(predicts: tf.Tensor, labels: tf.Tensor): tf.Tensor {
    return predicts.sub(labels).square().mean();
}

function readCsvFromUrl(fileUrl): Promise<any[]> {
    return new Promise((resolve, reject) => {
        let data: any = [];
        if (fileUrl.includes('https')) {
            console.log(`Reading file from url ${fileUrl} ...`);
            https.get(fileUrl, async (res) => {
                res.pipe(parser({delimiter: ','})).on('data', (row: any[]) => {
                    row = row.map(data => Number(data));
                    data.push(row);
                }).on('end', () => {
                    return resolve(data);
                }).on('error', (err) => {
                    return reject(err);
                });
            });
        }
        else
            return resolve(data);
    });
}

function normalizeDataset(features: any[], labels: any[]) {
    let maxLabel = 0;
    labels.forEach(label => {
        if (label > maxLabel) maxLabel = label;
    });
    labels = labels.map(label => label / maxLabel);
    for (let i = 0; i < features[0].length; i++) {
        let maxColumn = 0;
        features.forEach(featureRow => {
            if (featureRow[i] > maxColumn) maxColumn = featureRow[i];
        });
        for (let j = 0; j < features.length; j++) {
            features[j][i] = features[j][i] / maxColumn;
        }
    };
    return {features, labels};
}
