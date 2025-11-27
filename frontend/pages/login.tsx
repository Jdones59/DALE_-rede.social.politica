import React, { useContext } from 'react';
import { AuthContext } from '../../src/context/AuthContext';
import { useRouter } from 'next/router';

const Login = () => {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  // Form handling
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await login(e.target.realName.value, e.target.password.value);
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="realName" placeholder="Nome Real" />
      <input name="password" type="password" placeholder="Senha" />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;