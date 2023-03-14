import { useState } from 'react';
import Form from './Form';
export const Login = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [userData, setUserData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(email);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: pass,
        }),
      });
      const data = await response.json();
      if (data) {
        console.log(data[0])
        setUserData(data[0])
          console.log("USER DATA IS ",userData[0]);
        setAuthenticated(true);
        setUserData(data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  //setUserData(data.user);
  
  const handleLogInClick = () => {
    if (authenticated) {
      console.log("inside auth")
      props.onFormSwitch("form");
    }
  };

  function showInvalidCredentials() {
    alert('INVALID Credentials');
  }
  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" />
        <label htmlFor="password">password</label>
        <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
        {authenticated ? (
          
          <button type="submit" onClick={handleLogInClick}>Log In</button>
        ) : (
          <button type="submit">Log In</button>
          
        )}
      </form>
      <button className="link-btn" onClick={() => props.onFormSwitch("register")}>Don't have an account? Register here.</button>
      {authenticated && Object.keys(userData).length !== 0 && <Form authenticated={authenticated} userData={userData} />}

    </div>
  );
};

export default Login;
