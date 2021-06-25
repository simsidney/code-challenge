import Head from 'next/head';
import { FormEvent } from 'react';
import styles from 'src/styles/create_account.module.scss';

export default function CreateAccount() {
  async function handleSubmit(evt: FormEvent) {
    evt.preventDefault();
    const response = await fetch('/api/create_new_account', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    console.log(await response.json());
  }

  return (
    <>
      <Head>
        <title>Create Account</title>
      </Head>
      <article className={styles.article}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <button>Create Account</button>
        </form>
      </article>
    </>
  );
}
