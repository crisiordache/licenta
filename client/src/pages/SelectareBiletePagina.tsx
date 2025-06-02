import { SelectareBilete } from "../components/componenteClient/SelectareBilete";
import { AppBarConditional } from "../components/login/AppBar";

const SelectareBiletePagina = () => {
  return (
    <>
      <AppBarConditional></AppBarConditional>
      <SelectareBilete></SelectareBilete>
    </>
  );
};

export default SelectareBiletePagina;
