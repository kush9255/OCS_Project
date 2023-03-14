import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import { Login } from "./Login";
import { Register } from "./Register";
import { Form } from "./Form";

function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  console.log(currentForm);
  return (
    <div className="App">
      {
        currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : 
        currentForm==="form"? <Form onFormSwitch={toggleForm} /> :
        currentForm==="update"?<>Form onFormSwitch={toggleForm}</>:
         <Register onFormSwitch={toggleForm} />
      }
    </div>
  );
}

export default App;