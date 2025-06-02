import { Eveniment } from 'src/libs/entities/evenimente/eveniment.entity';

export class CreateTipBiletDTO {
  numeTip: string;
  pret: number;
  stocDisponibil: number;
  eveniment: Eveniment;
}
