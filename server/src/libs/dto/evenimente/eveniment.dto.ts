import { BiletDTO } from '../bilete/bilet.dto';

export class EvenimentDTO {
  idEveniment: number;
  numeEveniment: string;
  descriere: string;
  dataEveniment: Date;
  sala: number;
  bilete: BiletDTO[];
}

export class CreateEvenimentDTO {
  numeEveniment: string;
  descriere: string;
  dataEveniment: Date;
  oraIncepere: string;
  cuLocuriNominale: boolean;
  poster: string;
  sala: number;
}
