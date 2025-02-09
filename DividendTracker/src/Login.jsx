import React, { useEffect, useState } from "react";

function CreateLogIn({setifLogIn}) {
    return(
        <>
        <input type="text" placeholder="account"/>
        <input type="password " placeholder="password"/>
        <button onClick={() => setifLogIn(true)}>log in</button>
        </>
    );
}

export default CreateLogIn;