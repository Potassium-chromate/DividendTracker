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
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/login`,
                {
                    account: loginData.account,
                    password: loginData.password,
                },
                { withCredentials: true }
            );
            console.log("Log in successfully", response.data);
            setifLogIn(true);
            return true;
        } catch (error) {
            console.error("API request error: ", error);
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);
            }
            setifLogIn(false);
            return false;
        }
    };
    
    const signUp = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/create`,
                {
                    account: loginData.account,
                    password: loginData.password,
                }
            );
            console.log("Sign up successfully", response.data);
            return true;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                alert("An unexpected error occurred");
            }
            console.error(error);
            return false;
        }
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
