import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'cities' })
export class City {

  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;
}
