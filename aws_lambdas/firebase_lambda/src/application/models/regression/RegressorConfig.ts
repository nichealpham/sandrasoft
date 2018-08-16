import {MonicaConfig} from '../monica/MonicaConfig';

export class RegressorConfig implements MonicaConfig {
    epochs: number;
    iterations: number;
    shuffle: boolean;
    optimizer: string;
    normalize: boolean;
    learningRate: number;

    static mergeWithDefault(config: MonicaConfig): RegressorConfig {
        return mergeWithoutExtend(DefaultConfig, config);
    }
}

let DefaultConfig = {
    epochs: 1,
    iterations: 0,
    shuffle: true,
    optimizer: 'sgd',
    normalize: true,
    learningRate: 0.005,
}

function mergeWithoutExtend(object1, object2) {
    if (!object2)
        return object1;

    for (let key in object1) {
        object1[key] = object2[key] || object1[key];
    }
    return object1;
}

