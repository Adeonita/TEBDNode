import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'procedures' })
export class Procedure {

  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;
}
