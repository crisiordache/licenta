import { AppBarConditional } from "../components/login/AppBar";
import ListaEvenimente from "../components/paginaPrincipala/ListaEvenimente";

export const Acasa = () => {
  return (
    <>
      <AppBarConditional />
      <ListaEvenimente />
    </>
  );
};
