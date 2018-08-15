// https://stackoverflow.com/questions/40201589/serializing-an-es6-class-object-as-json
export class Serializer {
    public types: any;
    constructor(types){
        this.types = types;
    }
    serialize(inputClass): string {
        let idx = this.types.findIndex((e)=> {return e.name == inputClass.constructor.name});
        if (idx == -1) throw "type  '" + inputClass.constructor.name + "' not initialized";
        return JSON.stringify([idx, inputClass]);
    }
    deserialize(jstring) {
        let array = JSON.parse(jstring);
        let outputClass = new this.types[array[0]]();
        array[1].map(e=>{outputClass[e[0]] = e[1];});
        return outputClass;
    }
}