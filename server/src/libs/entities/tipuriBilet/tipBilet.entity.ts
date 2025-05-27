import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Bilet } from '../bilete/bilet.entity';
import { Eveniment } from '../evenimente/eveniment.entity';
import { Loc } from '../locuri/loc.entity';

@Entity()
export class TipBilet {
  @PrimaryGeneratedColumn()
  idTipBilet: number;

  @Column()
  pret: number;

  @Column()
  numeTip: string;

  @OneToMany(() => Bilet, (bilete) => bilete.tipBilet)
  bilete: Bilet;

  @ManyToOne(() => Eveniment, (eveniment) => eveniment.tipuriBilet)
  eveniment: Eveniment;

  @ManyToMany(() => Loc, (locuri) => locuri.tipuriBilet)
  locuri: Loc[];
}
