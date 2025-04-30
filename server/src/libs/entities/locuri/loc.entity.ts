import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Loc {
  @PrimaryGeneratedColumn()
  idLoc: number;

  @Column()
  rand: number;

  @Column()
  numarLoc: number;

  @Column({ default: false })
  esteRezervat: boolean;
}
