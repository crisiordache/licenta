import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Acasa } from "./pages/Acasa";
import { AdaugareEveniment } from "./pages/AdaugareEveniment";
import { AdaugareSala } from "./pages/AdaugareSala";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Acasa />} />
      <Route path="/adauga-eveniment" element={<AdaugareEveniment />} />
      <Route path="/adauga-sala" element={<AdaugareSala />} />
    </Routes>
  );
}

export default App;
