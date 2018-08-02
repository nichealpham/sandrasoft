export class ErrorBase {
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
            this.message = applyTemplate(this.message, ...params);
    }
};

function zeroFill(number, width ) {
    width -= number.toString().length;
    if (width > 0 )
        return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
    return number + "";
}

function applyTemplate(template, ...params) {
    return template.replace(/{(\d+)}/g, (match, number) => {
        return params[number] || match;
    });
}