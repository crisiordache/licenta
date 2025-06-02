import { Eveniment } from 'src/libs/entities/evenimente/eveniment.entity';
import { Loc } from 'src/libs/entities/locuri/loc.entity';
import { TipBilet } from 'src/libs/entities/tipuriBilet/tipBilet.entity';

export class CreateBiletDTO {
  codQR: string;
  esteRezervat: boolean;
  esteCumparat: boolean;
  eveniment: Eveniment;
  tipBilet: TipBilet;
  loc?: Loc;
}
