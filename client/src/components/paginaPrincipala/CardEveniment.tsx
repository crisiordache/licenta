import { Eveniment } from "../../types/Eveniment";
import TodayIcon from "@mui/icons-material/Today";
import LocationOnIcon from "@mui/icons-material/LocationOn"; // Corrected icon name
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Added for time
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { RolUtilizator, Utilizator } from "../../types/Utilizator";
import api from "../../api";
import "./CardEveniment.css";

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
        setUtilizator(null); // Set user to null on error (e.g., not logged in)
      }
    };
    fetchUtilizator();
  }, []);

  // Formatarea datei pentru afișare
  const formattedDate = new Date(eveniment.dataEveniment).toLocaleDateString(
    "ro-RO",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="eveniment-card">
      {eveniment.poster && (
        <div className="eveniment-card-poster">
          <img src={eveniment.poster} alt={eveniment.denumireEveniment} />
        </div>
      )}
      <div className="eveniment-card-content">
        <h2 className="eveniment-card-title">{eveniment.denumireEveniment}</h2>
        <p className="eveniment-card-description">{eveniment.descriere}</p>
        <div className="eveniment-card-details">
          <p className="eveniment-card-detail">
            <TodayIcon className="eveniment-card-icon" />
            <span>{formattedDate}</span>
          </p>
          <p className="eveniment-card-detail">
            <AccessTimeIcon className="eveniment-card-icon" />
            <span>
              {eveniment.oraIncepere} ({eveniment.dataEveniment} min)
            </span>
          </p>
          <p className="eveniment-card-detail">
            <LocationOnIcon className="eveniment-card-icon" />{" "}
            {/* Corrected icon name */}
            <span>
              {eveniment.sala?.numeSala || "Detalii Sala lipsesc"}
            </span>{" "}
            {/* Assuming eveniment.sala is an object with numeSala */}
          </p>
          <p className="eveniment-card-detail">
            <span>Locuri Nominale: {eveniment.cuLocNominal ? "Da" : "Nu"}</span>
          </p>
        </div>

        {/* Butonul "Cumpără bilet" vizibil doar pentru clienți */}
        {utilizator?.rol === RolUtilizator.CLIENT && (
          <Button
            variant="contained"
            color="primary"
            className="eveniment-card-buy-button"
          >
            Cumpără bilet
          </Button>
        )}
      </div>
    </div>
  );
};

export default CardEveniment;
