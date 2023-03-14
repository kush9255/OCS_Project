import React, { useState } from "react";

export const Form = (props) => {
    const userData = props.userData;
    return (
      <div>
        <h1>Welcome, {userData.name}!</h1>
        <p>Your email is: {userData.email}</p>
        <p>Your password is: {userData.password}</p>
      </div>
    );
   };

  
  export default Form;
  