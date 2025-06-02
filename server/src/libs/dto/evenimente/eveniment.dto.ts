import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CreateTipBiletDTO } from '../tipuriBilet/tipBilet.dto';

export class CreateEvenimentDTO {
  @IsString()
  @IsNotEmpty()
  numeEveniment: string;

  @IsString()
  @IsNotEmpty()
  descriere: string;

  @IsString()
  @IsNotEmpty()
  dataEveniment: string;

  @IsString()
  @IsNotEmpty()
  oraIncepere: string;

  @IsNumber()
  @IsPositive()
  durataEveniment: number;

  @IsBoolean()
  cuLocNominal: boolean;

  @IsOptional()
  @IsString()
  poster?: string;

  @IsNumber()
  @IsPositive()
  idSala: number;

  @IsOptional()
  tipuriBilete?: CreateTipBiletDTO[];
}
