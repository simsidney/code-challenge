export type Errors = Record<string, string>

const validator = (username: string, password: string): Errors => {
  const invalid: Errors = {};
  const validUser = new RegExp("^(?=.*[a-zA-Z0-9_-])(?=.{10,50}$)")
  const validPW = new RegExp("^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[!@#\$%])(?=.{20,50}$)")

  if (!validUser.test(username)) {
    invalid.user = 'Username must contain at least 10 characters.'
  }
  if (!validPW.test(password)) {
    invalid.pw = 'Weak password: Password must be at least 20 characters and contain at least 1 letter, 1 number, and 1 special character.'
  }
  return invalid;
}

export { validator }