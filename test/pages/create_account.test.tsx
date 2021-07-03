import { render, screen, act, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import CreateAccount from 'src/pages/create_account';
import '@testing-library/jest-dom/extend-expect';

describe('CreateAccount', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
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


  test('Password has been exposed', async () => {
    const { getByRole, getByLabelText } = render(<CreateAccount />);
    fetchMock.mockResponseOnce(JSON.stringify({ result: true }));
    userEvent.type(getByLabelText('Password:'), 'weakpass');
    var test = getByRole('button', { name: 'Create Account' });
    fireEvent.click(test);
    await act(() => Promise.resolve());
    expect(fetchMock).toBeCalledTimes(1);
    expect(fetchMock).toBeCalledWith('http://localhost:3000/api/password_exposed', {
      body: '{\"password\":\"weakpass\"}',
      method: 'POST',
    });
  });

  test('Should create an account', async () => {
    const { getByRole, getByLabelText } = render(<CreateAccount />);
    fetchMock.mockResponseOnce(JSON.stringify({ result: false }));
    fetchMock.mockResponseOnce(JSON.stringify({ result: true }));
    userEvent.type(getByRole('textbox',  {name: 'Username:' }), 'simsidney435435');
    userEvent.type(getByLabelText('Password:'), 'superusefulpass@#$34234324');
    var test = getByRole('button', { name: 'Create Account' });
    fireEvent.click(test);
    await act(() => Promise.resolve());
    expect(fetchMock).toBeCalledTimes(2);
    expect(fetchMock).toBeCalledWith('http://localhost:3000/api/password_exposed', {
      body: '{\"password\":\"superusefulpass@#$34234324\"}',
      method: 'POST',
    });
    expect(fetchMock).toBeCalledWith('/api/create_new_account', {
      body: '{\"username\":\"simsidney435435\",\"password\":\"superusefulpass@#$34234324\"}',
      method: 'POST',
    });
    const successMessage = screen.queryByText('Account successfully created')
    expect(successMessage).toBeInTheDocument()
  });

});


