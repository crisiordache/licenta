import { Eveniment } from "../../types/Eveniment";
import TodayIcon from "@mui/icons-material/Today";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import { Button } from "@mui/material";

interface Props {
  eveniment: Eveniment;
}

const CardEveniment = ({ eveniment }: Props) => (
  <div className="eveniment-card">
    <h2>{eveniment.denumireEveniment}</h2>
    <p>
      <TodayIcon></TodayIcon>
      {eveniment.dataEveniment}
    </p>
    <p>
      <LocationPinIcon></LocationPinIcon>
      {eveniment.denumireSala}
    </p>
    <Button variant="contained">Cumpără bilet</Button>
  </div>
);

export default CardEveniment;
