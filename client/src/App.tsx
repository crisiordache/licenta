import React from "react";
import "./App.css";
import ListaEvenimente from "./components/paginaPrincipala/ListaEvenimente";
import ButonLoginGoogle from "./components/login/ButonLoginGoogle";

function App() {
  return (
    <div className="App">
      <ButonLoginGoogle></ButonLoginGoogle>
      <ListaEvenimente></ListaEvenimente>
    </div>
  );
}

export default App;
