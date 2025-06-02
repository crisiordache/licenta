import { CreateBiletDTO } from '../bilete/bilet.dto';

export class ComandaDTO {
  idComanda: number;
  dataComanda: Date;
  valoare: number;
  utilizatorId: number;
  bilete: CreateBiletDTO[];
}

export class CreateComandaDTO {
  dataComanda: Date;
  valoare: number;
  utilizatorId: number;
}
