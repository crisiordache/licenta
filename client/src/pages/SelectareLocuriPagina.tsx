import { AppBarConditional } from "../components/login/AppBar";
import SelectareLocuri from "../components/componenteClient/SelectareLocuri";

export const SelectareLocuriPagina = () => {
  return (
    <>
      <AppBarConditional></AppBarConditional>
      <SelectareLocuri></SelectareLocuri>
    </>
  );
};
