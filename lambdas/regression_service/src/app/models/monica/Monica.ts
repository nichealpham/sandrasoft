import {MonicaType} from './MonicaType';

export interface Monica {
    _id?: string;
    name: string;
    type: MonicaType;
    loss: number;
    data: any;
    config: any;
    executionTime: number;
    createdAt: Date;
    updatedAt: Date;
}