"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda = require("ramda");
const parse_request_validatons_1 = require("../services/parse_request_validatons");
const request = {
    params: {
        userId: 'hygtsgdgdg',
    },
    query: {
        name: 'hello',
    },
    headers: {
        accessToken: 'werqwfqwjkfcnqkwjbfvqufgbquwkjfbgkj',
    },
    body: {
        userCreate: {
            _id: 'asdasd123123',
        },
        uid: 'asdasd123123',
        email: 'nichealpham@gmail.com',
        password: '123123123123',
    },
};
const test = {
    params: {
        userId: ['isAlphanumeric'],
    },
    query: {
        name: ['!isByteLength'],
    },
    headers: {
        accessToken: ['isAlphanumeric'],
    },
    body: {
        userCreate: {
            _id: ['isAlphanumeric'],
        },
        uid: ['isAlphanumeric'],
        email: ['isEmail'],
        password: ['isAlphanumeric'],
    },
};
console.log(ramda.mergeDeepWith(parse_request_validatons_1.validateMergeValue, request, test));
//# sourceMappingURL=services.test.js.map