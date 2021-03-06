import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';
import { Link } from 'react-router-dom';
import Banner from './Banner';

const Login = (props) => {
  const authContext = useContext(AuthContext);

  const { login, isAuthenticated, loadUser, error } = authContext;

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const { email, password } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  useEffect(() => {
    // Once authenticated,redirect.
    // history is used to change url inside our app,
    // while not reloading the page
    loadUser();

    if (isAuthenticated) {
      props.history.push('/');
    }
    if (error) {
      alert(error);
    }

    // eslint-disable-next-line
  }, [isAuthenticated, props.history, error]);

  const onSubmit = (e) => {
    e.preventDefault();
    login(user);
  };

  return (
    <div className='auth'>
      <Banner />
      <div className='login-form-container'>
        <div className='auth-title'>LOGIN</div>
        <div className='auth-sub'>Enter your login details below</div>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label htmlFor='email'>Email:</label>
            <input
              id='email'
              type='email'
              name='email'
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password:</label>
            <input
              id='password'
              type='password'
              name='password'
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <input type='submit' value='Login' className='auth-submit' />
          <div className='register-prompt'>
            Don't have an account?
            <div>
              <Link to='/register'>Sign up!</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
