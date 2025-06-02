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
export class Loc {
  @PrimaryGeneratedColumn()
  idLoc: number;

  @Column()
  rand: string;

  @Column()
  numar: number;

  @Column()
  x: number;

  @Column()
  y: number;

  @ManyToOne(() => Sala, (sala) => sala.locuri)
  sala: Sala;

  @OneToMany(() => Bilet, (bilete) => bilete.loc)
  bilete: Bilet[];
}
