import { render, screen, act, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import CreateAccount from 'src/pages/create_account';

describe('CreateAccount', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
    cleanup();
  });

  test('rendering', () => {
    const { getByRole, getByLabelText } = render(<CreateAccount />);
    expect(getByRole('textbox',  {name: 'Username:' })).toBeTruthy();
    expect(getByLabelText('Password:')).toBeTruthy();
    expect(getByRole('button', { name: 'Create Account' })).toBeTruthy();
  });

  test('PW strength', () => {
    render(<CreateAccount />);
    fetchMock.mockResponseOnce(JSON.stringify({}));
    userEvent.click(screen.getByText('Create Account'));
    expect(fetchMock).toBeCalledTimes(1);
    expect(fetchMock).toBeCalledWith('http://localhost:3000/api/password_exposed', {
      body: '{\"password\":\"\"}',
      method: 'POST',
    });
  });

  test('Password has been exposed', async () => {
    const { getByRole, getByLabelText } = render(<CreateAccount />);
    fetchMock.mockResponseOnce(JSON.stringify({ result: true }));
    userEvent.type(getByLabelText('Password:'), 'weakpass');
    fireEvent.click(getByRole('button', { name: 'Create Account' }));

    await act(() => Promise.resolve());
    expect(fetchMock).toBeCalledTimes(1);
    expect(fetchMock).toBeCalledWith('http://localhost:3000/api/password_exposed', {
      body: '{\"password\":\"weakpass\"}',
      method: 'POST',
    });
  });

});


