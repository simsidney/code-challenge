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
  errors?: Errors;
}

export default async function createNewAccount(req: NextApiRequest, res: NextApiResponse<BooleanResult>) {
  const { username, password }: CreateNewAccountParameters = JSON.parse(req.body);
  const errors: Errors = validator(username, password)
  const pwTest = ((errors.user || errors.pw) ? { result: false, errors: errors } : { result: true})
  res.status(200).json(pwTest);
}
