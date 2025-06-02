import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Acasa } from "./pages/Acasa";
import { AdaugareEveniment } from "./pages/AdaugareEveniment";
import { AdaugareSala } from "./pages/AdaugareSala";
import SelectareBiletePagina from "./pages/SelectareBiletePagina";
import { SelectareLocuriPagina } from "./pages/SelectareLocuriPagina";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Acasa />} />
      <Route path="/adauga-eveniment" element={<AdaugareEveniment />} />
      <Route path="/adauga-sala" element={<AdaugareSala />} />
      <Route
        path="/evenimente/:idEveniment/selectare-bilete"
        element={<SelectareBiletePagina />}
      />
      <Route
        path="evenimente/:idEveniment/selectare-locuri"
        element={<SelectareLocuriPagina />}
      />
    </Routes>
  );
}

export default App;
