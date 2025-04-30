import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Bilet } from '../bilete/bilet.entity';

@Entity()
export class TipBilet {
  @PrimaryGeneratedColumn()
  idTipBilet: number;

  @Column()
  pret: number;

  @OneToMany(() => Bilet, (bilet) => bilet.tipBilet)
  bilete: Bilet;
}
