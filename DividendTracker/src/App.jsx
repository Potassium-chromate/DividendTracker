import React, { useEffect, useState } from "react";
import "./App.css"
import CreateTable from "./Table.jsx"
import CreateLogIn from "./Login.jsx"

function App() {
  const [ifLogIn, setifLogIn] = useState(false);
  const [loginData, setLoginData] = useState({
    account: "",
    password: ""
  });
    return(
      <div className="main_page">
        {!ifLogIn && (<CreateLogIn
          setifLogIn={setifLogIn}
          loginData={loginData}
          setLoginData={setLoginData}
        />)}
        {ifLogIn && (<CreateTable
          setifLogIn={setifLogIn}
          loginData={loginData}
        />)}
      </div>
    );
}


export default App;
