import type { NextApiRequest, NextApiResponse } from 'next';
import  { validator }  from 'src/utils/input_checker';

export interface CreateNewAccountParameters {
  username: string;
  password: string;
}

interface Errors {
  user?: string;
  pw?: string;
}

interface BooleanResult {
  result: boolean;
  errors?: Errors|string;
}

async function checkPassword(text: string) {
  const response = await fetch('http://localhost:3000/api/password_exposed', {
    method: 'POST',
    body: JSON.stringify({password: text}),
  });
  return await response.json();
}

export default async function createNewAccount(req: NextApiRequest, res: NextApiResponse<BooleanResult>) {
  const { username, password }: CreateNewAccountParameters = JSON.parse(req.body);
  const errors: Errors = validator(username, password)
  const pwTest = await checkPassword(password)
    .then ((response) => {
      console.log(response)
      if (response.result) {
        return {result: false, errors: 'exposedPW'}
      } else {
        if (!errors.user && !errors.pw) {
          return {result: true}
        }
        if (errors.user || errors.pw) {
          return {result: false, errors: errors}
        }
      }
    })
    .catch(() => {
      res.status(500).end()
      throw new Error('Could not check password strength')
    })
  res.status(200).json(pwTest);
}
