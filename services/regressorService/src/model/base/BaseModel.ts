export class SavableModel {
    exportModel() {
        return JSON.stringify(this);
    }

    importModel(jString: string) {
        let instance = Object.create(SavableModel.prototype);
        return Object.assign(instance, JSON.parse(jString));
    }
}

// https://stackoverflow.com/questions/40201589/serializing-an-es6-class-object-as-json
export class SerializerModel{
    public types: any;
    constructor(types){
        this.types = types;
    }
    serialize(model) {
        let idx = this.types.findIndex((e)=> {return e.name == model.constructor.name});
        if (idx == -1) throw "type  '" + model.constructor.name + "' not initialized";
        return JSON.stringify([idx, Object.entries(model)]);
    }
    deserialize(jstring) {
        let array = JSON.parse(jstring);
        let model = new this.types[array[0]]();
        array[1].map(e=>{model[e[0]] = e[1];});
        return model;
    }
}