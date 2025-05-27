import { CreateLocDTO } from '../locuri/loc.dto';

export class CreateTipBiletDTO {
  numeTip: string;
  pret: number;
  locuri: CreateLocDTO[];
}
