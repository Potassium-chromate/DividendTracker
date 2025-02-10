import React, { useEffect, useState } from "react";
import "./Login.css"

function CreateLogIn({setifLogIn}) {
    return(
        <>
        <div className="main_page">
            <div className="login_container">
                <input type="text" placeholder="account"/>
                <input type="password " placeholder="password"/>
                <button onClick={() => setifLogIn(true)} className="login">log in</button>
            </div>
        </div>
        </>
    );
}

export default CreateLogIn;