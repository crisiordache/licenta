import "./App.css";
import AppBarConditional from "./components/login/AppBar";
import ListaEvenimente from "./components/paginaPrincipala/ListaEvenimente";

function App() {
  return (
    <div className="App">
      <AppBarConditional></AppBarConditional>
      <ListaEvenimente></ListaEvenimente>
    </div>
  );
}

export default App;
