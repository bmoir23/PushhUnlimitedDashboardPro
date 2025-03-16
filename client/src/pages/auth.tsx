import React from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function AuthPage({ isLogin }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-4">{isLogin ? <LoginForm /> : <RegisterForm />}</div>
    </div>
  );
}

export default AuthPage;