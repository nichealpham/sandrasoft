import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';

import {Monica} from '../monica/Monica';
import {MonicaType} from '../monica/MonicaType';
import {RegressorData} from './RegressorData';
import {RegressorConfig} from './RegressorConfig';

export class LinearRegressor implements Monica {
    _id?: string;
    name: string;
    type: MonicaType;
    loss: number;
    data: RegressorData;
    config: RegressorConfig;
    executionTime: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(monica?: Monica) {
        if (monica) 
            this.import(monica);
    }

    async train(features: number[][], labels: number[], epochsSuccessCallback?: any): Promise<boolean> {
        let nSamples = labels.length;
        let nFeatures = features[0].length;
        // Prepare weights and bias
        let weights = tf.variable(tf.tensor(this.data.weights).reshape([1, nFeatures]));
        let bias = tf.variable(tf.scalar(this.data.bias));
        // Prepare the dataset
        let xs = tf.tensor(features).reshape([nSamples, nFeatures]);
        let ys = tf.tensor(labels).reshape([nSamples, 1]);
        // Create optimizer
        let optimizer = tf.train[this.config.optimizer!](this.config.learningRate);
        for (let i = 0; i < this.config.iterations!; i++) {
            optimizer.minimize(() => {
                let loss = this.calLost(this.calPredict(xs, weights, bias), ys);
                if (epochsSuccessCallback)
                    epochsSuccessCallback(i, loss.dataSync()[0]);
                this.loss = loss.dataSync()[0];
                return loss;
            });
        };
        this.data.weights = weights.dataSync();
        this.data.bias = bias.dataSync()[0];
        this.data.nFeatures = nFeatures;
        return true;
    }

    predict(features: number[][]) {
        let xs = tf.tensor(features).reshape([features.length, this.data.nFeatures]);
        let weights = tf.tensor(this.data.weights).reshape([1, this.data.nFeatures]);
        let bias = tf.scalar(this.data.bias);
        return tf.tidy(() => {
            return xs.dot(weights.transpose()).add(bias);
        });
    }

    calPredict(xs: tf.Tensor, weights: tf.Variable, bias: tf.Variable): tf.Tensor {
        return tf.tidy(() => {
            return xs.dot(weights.transpose()).add(bias);
        });
    }

    calLost(predicts: tf.Tensor, labels: tf.Tensor): tf.Tensor {
        return predicts.sub(labels).square().mean();
    }

    import(monica: Monica) {
        this._id = monica._id;
        this.name = monica.name;
        this.type = monica.type;
        this.loss = monica.loss;
        this.data = monica.data;
        this.config = monica.config;
        this.executionTime = monica.executionTime;
        this.createdAt = monica.createdAt;
        this.updatedAt = monica.updatedAt;
    }

    export(): Monica {
        return {
            _id: this._id,
            name: this.name,
            type: this.type,
            loss: this.loss,
            data: this.data,
            config: this.config,
            executionTime: this.executionTime,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
}