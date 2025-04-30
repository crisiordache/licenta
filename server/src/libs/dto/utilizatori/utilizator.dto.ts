import { ComandaDTO } from '../comenzi/comanda.dto';

export class UtilizatorDTO {
  idUtilizator: number;
  nume: string;
  prenume: string;
  email: string;
  googleId: string;
  avatar: string;
  comenzi: ComandaDTO[];
}

export class CreateUtilizatorDTO {
  nume?: string;
  prenume?: string;
  email: string;
  googleId: string;
  avatar?: string;
}
