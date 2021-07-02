import Head from 'next/head';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import styles from 'src/styles/create_account.module.scss';
import logo from '../../public/wealthfront_logo.jpg';

export default function CreateAccount() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorUN, setErrorUN] = useState('');
  const [errorPW, setErrorPW] = useState('');
  const [pwExposed, setPwExposed] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(evt: FormEvent) {
    evt.preventDefault();
    await checkPassword(password)
      .then((response) => {
        if (response.result) {
          console.log('hello')
          setPwExposed(true)
        }
      })
      .catch(() => {
        throw new Error('Could not check PW strength')
      })

    const response = await fetch('/api/create_new_account', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json()
    console.log('data: ', data);
    if (data.result) {
      setSuccess(true);
      setPwExposed(false);
      setErrorUN('');
      setErrorPW('');
    } else {
      setSuccess(false);
      parseError(data.errors)
    }
  }

  const checkPassword = async function(text: string) {
    const response = await fetch('http://localhost:3000/api/password_exposed', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    return await response.json();
  }

  const parseError = (error: any) => {
    setErrorUN('');
    setErrorPW('');
    console.log('errors: ', error)
    // if (error === 'exposedPW') {
    //   setPwExposed(true);
    // }
    if (error.user) {
      setErrorUN(error.user)
    }
    if (error.pw) {
      setErrorPW(error.pw)
    }
  }

  const displayPW = () => {
    var pw:any = document.getElementById('password');
    if (pw.type === 'password') {
      pw.type = 'text'
    } else {
      pw.type = 'password'
    }
  }

  return (
    <>
      <Head>
        <title>Create Account</title>
      </Head>
      <article className={styles.article}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.logo}>
            <Image
              src={logo}
              alt='Wealthfront-logo'
            />
          </div>
          <h2 id={styles.title}>Create New Account</h2>
          <label className={styles.label}>Username: </label>
          <input
            className={styles.input}
            type='text' name='username'
            value={username}
            onChange={(e) => {setUsername(e.target.value)}}/>
          {errorUN ? <p className={styles.error}>{errorUN}</p> : null}
          <label className={styles.label} aria-labelledby='Password:'>Password:
            <input
              className={styles.input}
              id='password'
              type='password'
              name='password'
              value={password}
              onChange={(e) => {setPassword(e.target.value)}}/>
          </label>
          <div>
           <input
              className={styles.showPW}
              type='checkbox'
              onChange={displayPW}/>
           <label className={styles.showPWLabel}>Show Password</label>
          </div>
          {errorPW ? <p className={styles.error}>{errorPW}</p> : null}
          {pwExposed ? <p className={styles.error}>Your password has been exposed, please choose a different password</p> : null}
          <button className={styles.button} type='submit'>Create Account</button>
          {success? <p className={styles.success}>Account Successfully Created</p> : null}
        </form>
      </article>
    </>
  );
}
