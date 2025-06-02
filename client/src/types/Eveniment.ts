import Sala from "./Sala";

export interface Eveniment {
  cuLocNominal: boolean;
  sala: Sala;
  oraIncepere: string;
  descriere: string;
  idEveniment: number;
  numeEveniment: string;
  dataEveniment: string;
  durataEveniment: string;
  denumireSala: string;
  poster: string; 
}