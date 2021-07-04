import { expect } from '@jest/globals';
import createNewAccount from 'src/pages/api/create_new_account';
import { mockRequest } from 'test/utils';

describe('/api/create_new_account', () => {
  test('returns true', async () => {
    const { req, res } = mockRequest({
      method: 'POST',
      body: { username: 'sidneynguyen3000', password: 'makethispassword@#$pass20charsdsfdsf'},
    });

    await createNewAccount(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      result: true,
    });
  });

  test('invalid username returns false and user error', async () => {
    const { req, res } = mockRequest({
      method: 'POST',
      body: { username: 'simsidney', password: 'sdfjlkdsjfl324@#$dsfdssdf' },
    });

    await createNewAccount(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      result: false,
      errors: { user: 'Username must contain at least 10 characters.' }
    });
  });

  test('invalid password returns false and pw error', async () => {
    const { req, res } = mockRequest({
      method: 'POST',
      body: { username: 'simsidney234324', password: 'simsidney' },
    });

    await createNewAccount(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      result: false,
      errors: { pw: 'Weak password: Password must be at least 20 characters and contain at least 1 letter, 1 number, and 1 special character.' }
    });
  });

  test('invalid username and password returns false and user & pw error', async () => {
    const { req, res } = mockRequest({
      method: 'POST',
      body: { username: 'simsidney', password: 'simsidney' },
    });

    await createNewAccount(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      result: false,
      errors: {
        user: 'Username must contain at least 10 characters.',
        pw: 'Weak password: Password must be at least 20 characters and contain at least 1 letter, 1 number, and 1 special character.'
      }
    });
  });
});
