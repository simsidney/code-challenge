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

  test('Should render a username error when invalid username provided', async () => {
    const { getByRole, getByLabelText} = render(<CreateAccount />);
    fetchMock.mockResponseOnce(JSON.stringify({ result: false }))
    fetchMock.mockResponseOnce(JSON.stringify({ result: false, errors: { user: 'Username must contain at least 10 characters.' } }));
    userEvent.type(getByRole('textbox',  {name: 'Username:' }), 'simsidney');
    userEvent.type(getByLabelText('Password:'), 'superusefulpass@#$34234324');
    fireEvent.click(getByRole('button', { name: 'Create Account' }));
    await act(() => Promise.resolve());
    const errorMessageUser = screen.queryByText('Username must contain at least 10 characters.')
    expect(errorMessageUser).toBeInTheDocument()
  });

  test('Should render a password error when invalid password provided', async () => {
    const { getByRole, getByLabelText } = render(<CreateAccount />);
    fetchMock.mockResponseOnce(JSON.stringify({ result: false }))
    fetchMock.mockResponseOnce(JSON.stringify({ result: false, errors: { pw: 'Weak password: Password must be at least 20 characters and contain at least 1 letter, 1 number, and 1 special character.' } }));
    userEvent.type(getByRole('textbox',  {name: 'Username:' }), 'simsidney435435');
    userEvent.type(getByLabelText('Password:'), 'simsidney');
    fireEvent.click(getByRole('button', { name: 'Create Account' }));
    await act(() => Promise.resolve());
    const errorMessagePW = screen.queryByText('Weak password: Password must be at least 20 characters and contain at least 1 letter, 1 number, and 1 special character.')
    expect(errorMessagePW).toBeInTheDocument()
  });

});


