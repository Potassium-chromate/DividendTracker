import React, { useEffect, useState } from "react";
import "./App.css"
import CreateTable from "./Table.jsx"
import CreateLogIn from "./Login.jsx"

function App() {
  const [ifLogIn, setifLogIn] = useState(false);
    return(
      <div className="main_page">
        {!ifLogIn && (<CreateLogIn
          setifLogIn={setifLogIn}
        />)}
        {ifLogIn && (<CreateTable
          setifLogIn={setifLogIn}
        />)}
      </div>
    );
}


export default App;
