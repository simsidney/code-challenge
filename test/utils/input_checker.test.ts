import { validator } from 'src/utils/input_checker';

describe('validateUN&PW', () => {
  test('returns empty obj', () => {
    expect(validator('averylengthystring', '123sdflkjdsf@#$#@4sdfdsf')).toStrictEqual({});
  });

  test('returns user error', () => {
    expect(validator('abcd', 'sdlfkjdslkfj@#4sdfdsfcsd234234')).toStrictEqual({user: 'Username must contain at least 10 characters.'});
  });

  test('returns pw error for missing special char', () => {
    expect(validator('correctlength', 'missingspecialchars123567543')).toStrictEqual({pw: 'Weak password: Password must be at least 20 characters and contain at least 1 letter, 1 number, and 1 special character.' });
  });

  test('returns un & pw errors', () => {
    expect(validator('tooshort', 'donotlike')).toStrictEqual(
      {
        user: 'Username must contain at least 10 characters.',
        pw: 'Weak password: Password must be at least 20 characters and contain at least 1 letter, 1 number, and 1 special character.'
      }
    );
  });
});
