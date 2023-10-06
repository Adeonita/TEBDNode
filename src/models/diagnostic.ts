import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'diagnostics' })
export class Diagnostic {

  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;
}
