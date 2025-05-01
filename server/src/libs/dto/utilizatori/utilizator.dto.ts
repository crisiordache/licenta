import { RolUtilizator } from 'src/libs/entities/utilizatori/utilizator.entity';
import { ComandaDTO } from '../comenzi/comanda.dto';

export class UtilizatorDTO {
  idUtilizator: number;
  nume: string;
  prenume: string;
  email: string;
  googleId: string;
  avatar: string;
  rolUtilizator: RolUtilizator;
  comenzi: ComandaDTO[];
}

export class CreateUtilizatorDTO {
  nume?: string;
  prenume?: string;
  email: string;
  googleId: string;
  avatar?: string;
  rolUtilizator: RolUtilizator;
}
