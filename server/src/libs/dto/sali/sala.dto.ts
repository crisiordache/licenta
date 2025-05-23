import { EvenimentDTO } from '../evenimente/eveniment.dto';

export class SalaDTO {
  idSala: number;
  numeSala: string;
  adresa: string;
  capacitate: number;
  structura: string;
  evenimente: EvenimentDTO[];
}

export class CreateSalaDTO {
  numeSala: string;
  adresa: string;
  capacitate: number;
  structura: string;
}
