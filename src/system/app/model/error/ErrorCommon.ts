export class ErrorCommonData {
    static COM001 = 'You have no permission to retrieve this information!';
    static COM002 = 'Router must have request handler function!';
    static COM003 = 'Bad request!';
    static COM004 = 'The password must have atleast 8 chars with one uppercase letter, one lower case letter, one digit and one special character!';
    static COM005 = 'Unauthorized';
    static COM006 = 'Forbidden';
    static COM007 = 'Not found';
    static COM008 = 'Method not Allowed';
    static COM009 = 'Request timeout';
    static COM010 = 'Server lost connection!';
    static COM011 = 'Don\'t have any connection!';

    static COM101 = '{0} is invalid!';
    static COM102 = '{0} is not exists!';
    static COM103 = '{0} is not updated!';
    static COM104 = '{0} is already existed!';
    static COM105 = '{0} is required!';
    static COM106 = '{0} is not ready!';
    static COM107 = '{0} is not connected yet!';
    static COM108 = '{0} is incorrect!';
    static COM109 = '{0} is not activated!';
    static COM110 = '{0} is canceled!';
    static COM111 = '{0} is not available!';
    static COM112 = '{0} is not found!';
    static COM113 = '{0} has failed!';
    static COM114 = '{0} is missing!';

    static COM201 = 'Minimum {0} is {1} characters!';
    static COM202 = 'Maximum {0} is {1} characters!';
    static COM203 = '{0} is greater than {1}!';
};

import DataHelper from '../../helper/DataHelper';

export class BaseError {
    code: string;
    message?: string;

    constructor(prefix?: string, codeNum?: number, message?: string) {
        this.code = '';
        if (prefix)
            this.code = prefix;
        if (codeNum)
            this.code = zeroFill(codeNum, 3);
        if (message)
            this.message = message;
    }

    applyParams(params) {
        if (this.message && params && params.length > 0)
            this.message = DataHelper.applyTemplate(this.message, ...params);
    }
};

export class ErrorCommon extends BaseError {
    constructor(codeNum: number, ...params) {
        super('COM', codeNum);
        this.message = ErrorCommonData[this.code];
        this.applyParams(params);
    }
};

function zeroFill(number, width ) {
    width -= number.toString().length;
    if (width > 0 )
        return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
    return number + "";
}