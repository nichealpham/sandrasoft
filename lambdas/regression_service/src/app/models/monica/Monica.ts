import {MonicaType} from './MonicaType';

export interface IMonica {
    _id?: string;
    name: string;
    type?: MonicaType;
    loss?: number;
    data?: any;
    config?: any;
    executionTime?: number;
}

export class Monica {
    _id?: string;
    name: string;
    type: MonicaType;
    loss: number;
    data: any;
    config: any;
    executionTime: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(monica: IMonica) {
        let model = mergeWithoutExtend(DefaultMonica, monica);
        this._id = model._id;
        this.name = model.name;
        this.type = model.type;
        this.loss = model.loss;
        this.data = model.data;
        this.config = model.config;
        this.executionTime = model.executionTime;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

let DefaultMonica = {
    _id: null,
    name: 'new-monica',
    type: MonicaType.LinearRegression,
    loss: 0,
    data: null,
    config: null,
    executionTime: 0,
}

function mergeWithoutExtend(object1, object2) {
    if (!object2)
        return object1;

    for (let key in object1) {
        object1[key] = object2[key] || object1[key];
    }
    return object1;
}