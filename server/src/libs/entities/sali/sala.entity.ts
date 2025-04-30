import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Eveniment } from '../evenimente/eveniment.entity';

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

  @OneToMany(() => Eveniment, (eveniment) => eveniment.sala)
  evenimente: Eveniment[];
}
