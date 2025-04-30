import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Comanda } from '../comenzi/comanda.entity';

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

  @OneToMany(() => Comanda, (comanda) => comanda.utilizator)
  comenzi: Comanda[];
}
