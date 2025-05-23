import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Bilet } from '../bilete/bilet.entity';
import { Sala } from '../sali/sala.entity';
import { TipBilet } from '../tipuriBilet/tipBilet.entity';

@Entity()
export class Eveniment {
  @PrimaryGeneratedColumn()
  idEveniment: number;

  @Column()
  numeEveniment: string;

  @Column()
  descriere: string;

  @Column()
  dataEveniment: Date;

  @Column()
  oraIncepere: string;

  @Column()
  cuLocNominal: boolean;

  @Column()
  poster: string;

  @OneToMany(() => Bilet, (bilet) => bilet.eveniment)
  bilete: Bilet[];

  @ManyToOne(() => Sala, (sala) => sala.evenimente)
  sala: Sala;

  @OneToMany(() => TipBilet, (tipuriBilete) => tipuriBilete.eveniment)
  tipuriBilet: TipBilet[];
}
