import Sala from "./Sala";

export interface Eveniment {
  cuLocNominal: boolean;
  sala: Sala;
  oraIncepere: string;
  descriere: string;
  idEveniment: number;
  denumireEveniment: string;
  dataEveniment: string;
  denumireSala: string;
  poster: string; 
}