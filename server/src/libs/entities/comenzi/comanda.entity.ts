import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Utilizator } from '../utilizatori/utilizator.entity';
import { Bilet } from '../bilete/bilet.entity';

@Entity()
export class Comanda {
  @PrimaryGeneratedColumn()
  idComanda: number;

  @Column()
  dataComanda: Date;

  @Column()
  valoare: number;

  @ManyToOne(() => Utilizator, (utilizator) => utilizator.comenzi)
  utilizator: Utilizator;

  @OneToMany(() => Bilet, (bilet) => bilet.comanda)
  bilete: Bilet[];
}
