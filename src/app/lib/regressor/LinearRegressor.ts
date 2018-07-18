import * as tf from '@tensorflow/tfjs';

export class ModelConfig {
    trials?: number;
    shuffle?: boolean;
    optimizer?: string;
    learningRate?: number;
}

export class Model {
    public loss: any;
    public bias: any;
    public weights: any;
    public config: ModelConfig;

    constructor(config?: ModelConfig) {
        this.config = {trials: 100, shuffle: true, optimizer: 'sgd', learningRate: 0.005};
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