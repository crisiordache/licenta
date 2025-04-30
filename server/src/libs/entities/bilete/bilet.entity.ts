import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Comanda } from '../comenzi/comanda.entity';
import { Eveniment } from '../evenimente/eveniment.entity';
import { TipBilet } from '../tipuriBilet/tipBilet.entity';

@Entity()
export class Bilet {
  @PrimaryGeneratedColumn()
  idBilet: number;

  @Column()
  codQR: string;

  @ManyToOne(() => Comanda, (comanda) => comanda.bilete)
  comanda: Comanda;

  @ManyToOne(() => Eveniment, (eveniment) => eveniment.bilete)
  eveniment: Eveniment;

  @ManyToOne(() => TipBilet, (tipBilet) => tipBilet.bilete)
  tipBilet: TipBilet;
}
