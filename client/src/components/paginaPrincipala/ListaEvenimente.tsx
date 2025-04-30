import { useEffect, useState } from "react";
import { Eveniment } from "../../types/Eveniment";
import api from "../../api";
import CardEveniment from "./CardEveniment";

const ListaEvenimente = () => {
  const [evenimente, setEvenimente] = useState<Eveniment[]>([]);

  useEffect(() => {
    const fetchEvenimente = async () => {
      try {
        const response = await api.get("/evenimente");
        setEvenimente(response.data);
      } catch (error) {
        console.error("Eroare la obtinerea evenimentelor!", error);
      }
    };
    fetchEvenimente();
  }, []);

  return (
    <div>
      <h1> Evenimente </h1>
      {evenimente.map((eveniment) => (
        <CardEveniment
          key={eveniment.idEveniment}
          eveniment={eveniment}
        ></CardEveniment>
      ))}
    </div>
  );
};

export default ListaEvenimente;
