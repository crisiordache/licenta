import { BiletDTO } from '../bilete/bilet.dto';

export class TipBiletDTO {
  idTipBilet: number;
  pret: number;
  bilete: BiletDTO[];
}

export class CreateTipBiletDTO {
  pret: number;
}
