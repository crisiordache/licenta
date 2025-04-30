import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Bilet } from '../bilete/bilet.entity';
import { Sala } from '../sali/sala.entity';

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
  poster: string;

  @OneToMany(() => Bilet, (bilet) => bilet.eveniment)
  bilete: Bilet[];

  @ManyToOne(() => Sala, (sala) => sala.evenimente)
  sala: Sala;
}
