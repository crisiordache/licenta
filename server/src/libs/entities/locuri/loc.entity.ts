import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Bilet } from '../bilete/bilet.entity';
import { Sala } from '../sali/sala.entity';
import { TipBilet } from '../tipuriBilet/tipBilet.entity';

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

  @ManyToMany(() => TipBilet, (tipuriBilet) => tipuriBilet.locuri)
  @JoinTable({
    name: 'tip_bilet_loc',
    joinColumn: { name: 'idLoc', referencedColumnName: 'idLoc' },
    inverseJoinColumn: {
      name: 'idTipBilet',
      referencedColumnName: 'idTipBilet',
    },
  })
  tipuriBilet: TipBilet[];
}
