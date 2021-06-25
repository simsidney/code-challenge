import { expect } from '@jest/globals';
import createNewAccount from 'src/pages/api/create_new_account';
import { mockRequest } from 'test/utils';

describe('/api/create_new_account', () => {
  test('returns true', async () => {
    const { req, res } = mockRequest({
      method: 'POST',
      body: {},
    });

    await createNewAccount(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      result: true,
    });
  });
});
