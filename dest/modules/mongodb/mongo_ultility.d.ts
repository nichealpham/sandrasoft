export declare class MongoUltility {
    static isObjectId(id: any): boolean;
    static toObjectId(id: any): any;
    static handleDataModel<T>(data: any, dataType: {
        new (d: any): T;
    }): string | T;
    static handleFileModel(file: any): string;
    static filterDataInput<T>(entity: T, data: any, fields: string[]): T;
    static applyTemplate(template: string, ...params: any[]): string;
    static convertToCurrency(value: number, option: any): string;
    static convertStringToBoolean(val: string): boolean;
}
