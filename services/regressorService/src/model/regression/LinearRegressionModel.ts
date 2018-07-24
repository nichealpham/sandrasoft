import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';
import {SavableModel} from '../base/BaseModel';

export class ModelConfig {
    trials?: number;
    shuffle?: boolean;
    optimizer?: string;
    normalize?: boolean;
    learningRate?: number;
    indexLabel?: number;
    indexFeatures?: number[];
}

export class LinearRegressionModel extends SavableModel {
    public weights: tf.Variable;
    public bias: tf.Variable;
    public config: ModelConfig;
    public loss: number;
    public nSamples: number;
    public nFeatures: number;

    constructor(config?: ModelConfig) {
        super();
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

    async train(features: number[][], labels: number[], epochsSuccessCallback?: any) {
        this.nSamples = labels.length;
        this.nFeatures = features[0].length;
        // Prepare weights and bias
        this.weights = tf.variable(tf.randomNormal([1, this.nFeatures]));
        this.bias = tf.variable(tf.randomNormal([1, this.nFeatures]));
        // Prepare the dataset
        let xs = tf.tensor(features).reshape([this.nSamples, this.nFeatures]);
        let ys = tf.tensor(labels).reshape([this.nSamples, 1]);
        // Create optimizer
        let optimizer = tf.train[this.config.optimizer!](this.config.learningRate);
        for (let i = 0; i < this.config.trials!; i++) {
            optimizer.minimize(() => {
                let loss = this.calLost(this.calPredict(xs, this.weights, this.bias), ys);
                if (epochsSuccessCallback)
                    epochsSuccessCallback(i, loss.dataSync()[0]);
                this.loss = loss.dataSync()[0];
                return loss;
            });
        };
    }

    predict(features: number[][]) {
        return this.calPredict(tf.tensor(features).reshape([features.length, features[0].length]), this.weights, this.bias);
    }

    calPredict(xs: tf.Tensor, weights: tf.Variable, bias: tf.Variable): tf.Tensor {
        return tf.tidy(() => {
            return xs.mul(weights).add(bias).dot(tf.fill([weights.dataSync().length, 1], 1));
        });
    }

    calLost(predicts: tf.Tensor, labels: tf.Tensor): tf.Tensor {
        return predicts.sub(labels).square().mean();
    }
}