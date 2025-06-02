import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Bilet } from '../bilete/bilet.entity';
import { Eveniment } from '../evenimente/eveniment.entity';

@Entity()
export class TipBilet {
  @PrimaryGeneratedColumn()
  idTipBilet: number;

  @Column()
  pret: number;

  @Column()
  numeTip: string;

  @Column()
  stocDisponibil: number;

  @OneToMany(() => Bilet, (bilete) => bilete.tipBilet)
  bilete: Bilet;

  @ManyToOne(() => Eveniment, (eveniment) => eveniment.tipuriBilet)
  eveniment: Eveniment;
}
