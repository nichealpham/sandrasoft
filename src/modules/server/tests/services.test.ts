import * as ramda from 'ramda';
import { validateMergeValue } from '../services/parse_request_validatons';

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

const tests = [
    {
        params: {
            userId: ['!isEmpty'],
        },
    },
    {
        query: {
            name: ['!isEmpty'],
        },
    },
    {
        headers: {
            accessToken: ['!isEmpty'],
        },
    },
    { 
        query: {
            name: ['!isEmpty'],
        },
        headers: {
            accessToken: ['!isEmpty'],
        },
    },
    {
        body: {
            userCreate: {
                _id: ['isAlphanumeric'],
            },
        },
    },
    {
        body: {
            userCreate: {
                _id: ['isAlphanumeric'],
            },
            uid: ['!isEmpty'],
        },
    },
    {
        body: {
            uid: ['!isEmpty'],
        },
    },
    {
        body: {
            userCreate: {},
            uid: ['!isEmpty'],
        },
    },
    {
        body: {
            userCreate: {
                _id: ['isAlphanumeric'],
            },
            uid: ['!isEmpty'],
            email: ['isEmail'],
            password: ['!isEmpty'],
        },
    },
];

describe(`ramda.mergeDeepWith(fn, value, schema) should success`, () => {
    it(`name = hello != isEmpty should return true`, () => {
        expect(JSON.stringify(ramda.mergeDeepWith(
            validateMergeValue,
            request,
            test
        )).includes(':false')).toEqual(false);
    });

    for (let i = 0; i < tests.length; i++) {
        const okTest = tests[i];
        it(`ok tests ${i} should return true`, () => {
            expect(JSON.stringify(ramda.mergeDeepWith(
                validateMergeValue,
                request,
                okTest
            )).includes(':false')).toEqual(false);
        });
    }

    it(`name = hello == isEmpty should return false`, () => {
        test.query.name = ['isEmpty'];
        expect(JSON.stringify(ramda.mergeDeepWith(
            validateMergeValue,
            request,
            test
        )).includes(':false')).toEqual(true);
    });

    it(`name = '' == isEmpty should return true`, () => {
        request.query.name = '';
        expect(JSON.stringify(ramda.mergeDeepWith(
            validateMergeValue,
            request,
            test
        )).includes(':false')).toEqual(false);
    });
});