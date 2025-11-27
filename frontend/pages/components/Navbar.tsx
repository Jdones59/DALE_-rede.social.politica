import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/login">Login</Link>
      <Link href="/register">Registrar</Link>
      {/* Logout, etc. */}
    </nav>
  );
};

export default Navbar;