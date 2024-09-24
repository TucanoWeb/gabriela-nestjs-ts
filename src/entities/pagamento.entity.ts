import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Pagamento {
  @PrimaryGeneratedColumn()
  codigo: number;

  @Column()
  codAssinatura: number;

  @Column('float')
  valorPago: number;

  @Column()
  dataPagamento: Date;
}
