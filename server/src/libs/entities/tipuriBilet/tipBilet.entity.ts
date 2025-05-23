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
  numarBilete: number;

  @OneToMany(() => Bilet, (bilet) => bilet.tipBilet)
  bilete: Bilet;

  @ManyToOne(() => Eveniment, (eveniment) => eveniment.tipuriBilet)
  eveniment: Eveniment;
}
