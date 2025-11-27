// Similar to login.tsx but for register
import React from 'react';
import api from '../components/services/api';
import { useRouter } from 'next/router';

const Register = () => {
  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await api.post('/auth/register', {
      realName: e.target.realName.value,
      password: e.target.password.value,
    });
    router.push('/login');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="realName" placeholder="Nome Real" />
      <input name="password" type="password" placeholder="Senha" />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Register;