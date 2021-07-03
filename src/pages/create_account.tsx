import Head from 'next/head';
import { FormEvent, useState } from 'react';
import styles from 'src/styles/create_account.module.scss';

export default function CreateAccount() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorUN, setErrorUN] = useState('');
  const [errorPW, setErrorPW] = useState('');
  const [pwExposed, setPwExposed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formFailure, setFormFailure] = useState(false);

  async function handleSubmit(evt: FormEvent) {
    evt.preventDefault();
    setFormFailure(false)
    setPwExposed(false);
    try {
      const response = await fetch('http://localhost:3000/api/password_exposed', {
      method: 'POST',
      body: JSON.stringify({ password }),
      });
      const verifyPW = await response.json();
      console.log(verifyPW)
      if (verifyPW.result) {
        setPwExposed(true)
      }
      if (!pwExposed) {
        const response = await fetch('/api/create_new_account', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (data.result) {
          setSuccess(true);
          setPwExposed(false);
          setErrorUN('');
          setErrorPW('');
        } else {
          setSuccess(false);
          parseError(data.errors);
        }
      }
    }
    catch (error) {
      setFormFailure(true)
    }

  }

  const parseError = (error: any) => {
    setErrorUN('');
    setErrorPW('');
    if (error.user) {
      setErrorUN(error.user);
    }
    if (error.pw) {
      setErrorPW(error.pw);
    }
  }

  const displayPW = () => {
    var pw:any = document.getElementById('password');
    if (pw.type === 'password') {
      pw.type = 'text';
    } else {
      pw.type = 'password';
    }
  }

  return (
    <>
      <Head>
        <title>Create Account</title>
      </Head>
      <article className={styles.article}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <img
            className={styles.logo}
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Wealthfront_Logo.svg/1200px-Wealthfront_Logo.svg.png'
            alt='Wealthfront-logo'
          />
          <h2 id={styles.title}>Create New Account</h2>
          <label className={styles.label}>Username:
          <input
            className={styles.input}
            id='username'
            type='text'
            name='username'
            value={username}
            onChange={(e) => {setUsername(e.target.value)}}/>
          </label>
          {errorUN ? <p className={styles.error}>{errorUN}</p> : null}
          <label className={styles.label}>Password:
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
          <button className={styles.button}>Create Account</button>
          {success ? <p className={styles.success}>Account successfully created</p> : null}
          {formFailure ? <p className={styles.failure}>Error: Please try again.</p> : null}
        </form>
      </article>
    </>
  );
}
