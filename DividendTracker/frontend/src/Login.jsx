import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Login.css"

function CreateLogIn({setifLogIn, loginData, setLoginData}) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value, 
        });
    };

    const logIn = async () => {
        axios.post("http://127.0.0.1:5001/users/login", {
            account: loginData.account,
            password: loginData.password
        })
        .then(response => {
            console.log("Log in successfully");
            setifLogIn(true);
            return true;
        })
        .catch(error => {
            console.error("API request error: ", error.message);
	    if (error.response) {
	      console.error("Response error: ", error.response);
	    }
            setifLogIn(false);
            return false;
        });
    };
    
    const signUp = async () => {
        axios.post("http://127.0.0.1:5001/users/create", {
            account: loginData.account,
            password: loginData.password
        })
        .then(response => {
            console.log("Sign up successfully");
            return true;
        })
        .catch(error => {
            if (error.response) {
                // Access the error message from the server's JSON response
                alert(error.response.data.error);
            } else {
                alert("An unexpected error occurred");
            }
            console.error(error);
            return false;
        });
    };
    

    return(
        <>
        <div className="main_page">
            <div className="login_container">
                <h2>Log in</h2>
                <input type="text" placeholder="account" name="account" onChange={handleInputChange}/>
                <input type="password" placeholder="password" name="password" onChange={handleInputChange}/>
                <div className="login_and_signup">
                    <button onClick={signUp} className="signup" >Sign up</button>
                    <button onClick={logIn} className="login">Log in</button>
                </div>
                
            </div>
        </div>
        </>
    );
}

export default CreateLogIn;
