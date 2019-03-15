import { expect } from 'chai';

import jwt from 'jsonwebtoken';

import {
  defaultAddtokenToRequest,
  // defaultApiRequestErrorHandler,
  // defaultCheckResponseIsOk,
  defaultCheckTokenFreshness,
  // defaultRetrieveToken,
  // defaultShouldRequestNewToken,
} from './defaultMethods';
import {
  MIN_TOKEN_LIFESPAN, defaultHeaders } from '../constants';

describe('checkTokenFreshness', () => {
  const tests = [
    {
      desc: 'should be true if the difference between the token expiry & now is greater than the min token lifespan',
      input: [
        { foo: 'bar' },
        'TOPSECRET',
        { expiresIn: '1 hour' },
      ],
      expected: true,
    },
    {
      desc: 'should be false if the difference between the token expiry & now is less than the min token lifespan',
      input: [
        { foo: 'bar' },
        'TOPSECRET',
        { expiresIn: '1 minute' },
      ],
      expected: false,
    },
  ];

  tests.forEach((t) => {
    it(t.desc, () => {
      const {
        input,
        expected,
      } = t;
      
      // Arrange
      const token = jwt.sign(...input);
      
      // Act
      const freshness = defaultCheckTokenFreshness(token, MIN_TOKEN_LIFESPAN);
      
      // Assert
      expect(freshness).to.equal(expected);
    });
  });
});

describe('addTokenToRequest', () => {
  const token = '123';
  const body = { foo: 'bar' };
  const tests = [
    {
      desc: 'should return a request object with the token in the Authorization header',
      input: [
        defaultHeaders,
        body,
        token,
      ],
      expected: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
        body,
      },
    },
  ];

  tests.forEach((t) => {
    it(t.desc, () => {
      const {
        input,
        expected,
      } = t;
      
      // Act
      const req = defaultAddtokenToRequest(...input);
      
      // Assert
      expect(req).to.deep.equal(expected);
    });
  });
});
