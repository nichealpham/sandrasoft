import * as tf from '@tensorflow/tfjs';
import * as timer from 'node-simple-timer';

export class LinearRegressorModelConfig {
    trials?: number;
    shuffle?: boolean;
    optimizer?: string;
    learningRate?: number;
}

import * as https from 'https';
import * as parser from 'csv-parse';

export class LinearRegressorService {
    static async trainFromCSV(fileUrl: string, config?: LinearRegressorModel) {
        let totalTimer = new timer.Timer();
        totalTimer.start();
        // Initiate variables
        let labels_data: any[] = [];
        let features_data: any[] = [];
        // Read data from url
        let data = await readCsvFromUrl(fileUrl);
        data.forEach(row => {
            if (!row || !row.length || !row[0])
                return;
            else {
                labels_data.push(Math.floor(row[row.length - 2] / 1000));
                features_data.push([row[3] / 1000, row[4] / 1000, row[6] / 200]);
            }
        });
        let model = new LinearRegressorModel(config);
        await model.train(features_data, labels_data, (i, cost) => {
            console.log(`Epoch ${i} loss is: ${cost}`);
        });
        totalTimer.end();
        return {
            loss: model.loss,
            bias: model.bias,
            config: model.config,
            weights: model.weights,
            executionTime: `${totalTimer.seconds().toFixed(2)}s`
        }
    }
}

export class LinearRegressorModel {
    public loss: any;
    public bias: any;
    public config: any;
    public weights: any;

    constructor(config?: LinearRegressorModel) {
        this.config = {trials: 50, shuffle: true, optimizer: 'sgd', learningRate: 0.005};
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