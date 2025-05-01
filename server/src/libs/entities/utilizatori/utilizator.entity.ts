import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Comanda } from '../comenzi/comanda.entity';

export enum RolUtilizator {
  CLIENT = 'client',
  ADMIN = 'admin',
}

@Entity()
export class Utilizator {
  @PrimaryGeneratedColumn()
  idUtilizator: number;

  @Column({ nullable: true })
  nume: string;

  @Column({ nullable: true })
  prenume: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  googleId: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: RolUtilizator.CLIENT })
  rolUtilizator: RolUtilizator;

  @OneToMany(() => Comanda, (comanda) => comanda.utilizator)
  comenzi: Comanda[];
}
