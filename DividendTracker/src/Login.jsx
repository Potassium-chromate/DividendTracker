import React, { useEffect, useState } from "react";
import "./Login.css"

function CreateLogIn({setifLogIn}) {
    return(
        <>
        <div className="main_page">
            <div className="login_container">
                <h2>Log in</h2>
                <input type="text" placeholder="account"/>
                <input type="password" placeholder="password"/>
                <div className="login_and_signup">
                    <button className="signup">Sign up</button>
                    <button onClick={() => setifLogIn(true)} className="login">Log in</button>
                </div>
                
            </div>
        </div>
        </>
    );
}

export default CreateLogIn;