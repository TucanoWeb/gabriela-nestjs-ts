import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Assinatura {
  @PrimaryGeneratedColumn()
  codigo: number;

  @Column()
  codApp: number;

  @Column()
  codCli: number;

  @Column()
  inicioVigencia: Date;

  @Column()
  fimVigencia: Date;
}
