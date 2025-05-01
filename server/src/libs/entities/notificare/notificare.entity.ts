import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notificare {
  @PrimaryGeneratedColumn()
  idNotificare: number;
  @Column()
  titlu: string;
  @Column()
  text: string;
}
