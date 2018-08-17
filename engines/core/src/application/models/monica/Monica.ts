import {MonicaType} from './MonicaType';

export interface IMonica {
    _id: string;
    name: string;
    type?: MonicaType;
    loss?: number;
    data?: any;
    config?: any;
    executionTime?: number;
}

export class Monica {
    _id: string;
    name: string;
    type: MonicaType;
    loss: number;
    data: any;
    config: any;
    executionTime: number;
    createdAt: number;
    updatedAt: number;

    constructor(monica: IMonica) {
        let DefaultMonica = {
            _id: null,
            name: 'new-monica',
            type: MonicaType.LinearRegression,
            loss: 0,
            data: null,
            config: {
                iterations: 0,
                shuffle: true,
                normalize: true,
                learningRate: 0.01,
            },
            executionTime: 0,
        };
        let model = mergeWithoutExtend(DefaultMonica, monica);
        this._id = model._id;
        this.name = model.name;
        this.type = model.type;
        this.loss = model.loss;
        this.data = model.data;
        this.config = model.config;
        this.executionTime = model.executionTime;
        this.createdAt = new Date().getTime();
        this.updatedAt = new Date().getTime();
    }

    exportData() {
        return {
            _id: this._id,
            name: this.name,
            type: this.type,
            loss: this.loss,
            data: this.data,
            config: this.config,
            executionTime: this.executionTime,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}

function mergeWithoutExtend(object1, object2) {
    if (!object2)
        return object1;

    for (let key in object1) {
        object1[key] = object2[key] || object1[key];
    }
    return object1;
}