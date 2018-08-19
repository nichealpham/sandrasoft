import {ErrorBase} from './ErrorBase';
import {ErrorData} from './ErrorData';

export class ErrorSystem extends ErrorBase {
    constructor(codeNum: number, ...params) {
        super('COM', codeNum);
        this.message = ErrorData[this.code];
        this.applyParams(params);
    }
};

