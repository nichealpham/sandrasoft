export class Greeting {
    public message: String;
    constructor(message?: String) {
        this.message = message || 'Greeting to serverless 1.0 !!!';
    }
}