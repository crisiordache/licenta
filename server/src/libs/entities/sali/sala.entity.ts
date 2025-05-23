import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Eveniment } from '../evenimente/eveniment.entity';
import { Loc } from '../locuri/loc.entity';

@Entity()
export class Sala {
  @PrimaryGeneratedColumn()
  idSala: number;

  @Column()
  numeSala: string;

  @Column()
  adresa: string;

  @Column()
  capacitate: number;

  @Column('json')
  structura: string;

  @OneToMany(() => Eveniment, (eveniment) => eveniment.sala)
  evenimente: Eveniment[];

  @OneToMany(() => Loc, (locuri) => locuri.sala)
  locuri: Loc[];
}
