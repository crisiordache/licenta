import { Eveniment } from "../../types/Eveniment";
import TodayIcon from "@mui/icons-material/Today";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { RolUtilizator, Utilizator } from "../../types/Utilizator";
import api from "../../api";
import { useNavigate } from "react-router-dom";

import "./CardEveniment.css";

interface Props {
  eveniment: Eveniment;
}

const CardEveniment = ({ eveniment }: Props) => {
  const [utilizator, setUtilizator] = useState<Utilizator | null>(null);
  const navigate = useNavigate();

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

  const dataFormatata = new Date(eveniment.dataEveniment).toLocaleDateString(
    "ro-RO",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const posterUrl = eveniment.poster
    ? `http://localhost:8000/${eveniment.poster.replace(/\\/g, "/")}`
    : undefined;

  const handleCumparaBiletClick = () => {
    // Corect: folosește backticks ` ` și numele corect al variabilei `eveniment.idEveniment`
    navigate(`/evenimente/${eveniment.idEveniment}/selectare-bilete`); // Am actualizat calea pentru a se potrivi cu ruta anterioară
  };

  return (
    <div className="eveniment-card-orizontal">
      {posterUrl && (
        <div className="eveniment-card-orizontal-poster">
          <img src={posterUrl} alt={eveniment.numeEveniment} />
        </div>
      )}
      <div className="eveniment-card-orizontal-content">
        <h2 className="eveniment-card-orizontal-title">
          {eveniment.numeEveniment}
        </h2>
        <p className="eveniment-card-orizontal-description">
          {eveniment.descriere}
        </p>
        <div className="eveniment-card-orizontal-details">
          <p className="eveniment-card-orizontal-detail">
            <TodayIcon className="eveniment-card-orizontal-icon" />
            <span>{dataFormatata}</span>
          </p>
          <p className="eveniment-card-orizontal-detail">
            <AccessTimeIcon className="eveniment-card-orizontal-icon" />
            <span>
              {eveniment.oraIncepere} ({eveniment.durataEveniment} min)
            </span>
          </p>
          <p className="eveniment-card-orizontal-detail">
            <LocationOnIcon className="eveniment-card-orizontal-icon" />
            <span>{eveniment.sala?.numeSala || "Detalii Sala lipsesc"}</span>
          </p>
        </div>

        {utilizator?.rol === RolUtilizator.CLIENT && (
          <Button
            variant="contained"
            color="primary"
            className="eveniment-card-orizontal-buy-button"
            onClick={handleCumparaBiletClick}
          >
            Cumpără bilet
          </Button>
        )}
      </div>
    </div>
  );
};

export default CardEveniment;
