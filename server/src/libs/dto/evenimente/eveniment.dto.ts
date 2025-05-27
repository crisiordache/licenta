import { CreateTipBiletDTO } from '../tipuriBilet/tipBilet.dto';

export class CreateEvenimentDTO {
  numeEveniment: string;
  descriere: string;
  dataEveniment: string;
  oraIncepere: string;
  durataEveniment: number;
  cuLocNominal: boolean;
  poster?: string;
  idSala: number;
  pretBiletGeneralImplicit?: number;
  tipuriBilete?: CreateTipBiletDTO[];
}
