import { Eveniment } from "../../types/Eveniment";
import TodayIcon from "@mui/icons-material/Today";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { RolUtilizator, Utilizator } from "../../types/Utilizator";
import api from "../../api";

interface Props {
  eveniment: Eveniment;
}

const CardEveniment = ({ eveniment }: Props) => {
  const [utilizator, setUtilizator] = useState<Utilizator | null>(null);

  useEffect(() => {
    const fetchUtilizator = async () => {
      try {
        const res = await api.get("/auth/profile", {
          withCredentials: true,
        });
        if (res.data) {
          setUtilizator(res.data);
        }
      } catch (error) {
        setUtilizator(null);
      }
    };
    fetchUtilizator();
  }, []);
  return (
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
      {utilizator?.rol === RolUtilizator.CLIENT && (
        <Button variant="contained">Cumpără bilet</Button>
      )}
    </div>
  );
};

export default CardEveniment;
