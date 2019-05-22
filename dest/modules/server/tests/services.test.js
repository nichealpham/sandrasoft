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
        userId: ['!isEmpty'],
    },
    query: {
        name: ['!isEmpty'],
    },
    headers: {
        accessToken: ['!isEmpty'],
    },
    body: {
        userCreate: {
            _id: ['isAlphanumeric'],
        },
        uid: ['!isEmpty'],
        email: ['isEmail'],
        password: ['!isEmpty'],
    },
};
describe(`ramda.mergeDeepWith(fn, value, schema) should success`, () => {
    it(`name = hello != isEmpty should return true`, () => {
        expect(JSON.stringify(ramda.mergeDeepWith(parse_request_validatons_1.validateMergeValue, request, test)).includes(':false')).toEqual(false);
    });
    it(`name = hello == isEmpty should return false`, () => {
        test.query.name = ['isEmpty'];
        expect(JSON.stringify(ramda.mergeDeepWith(parse_request_validatons_1.validateMergeValue, request, test)).includes(':false')).toEqual(true);
    });
    it(`name = '' == isEmpty should return true`, () => {
        request.query.name = '';
        expect(JSON.stringify(ramda.mergeDeepWith(parse_request_validatons_1.validateMergeValue, request, test)).includes(':false')).toEqual(false);
    });
});
//# sourceMappingURL=services.test.js.map