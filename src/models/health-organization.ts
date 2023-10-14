import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { City } from './city';

@Entity({ name: 'health_organizations' })
export class HealthOrganization {

  @PrimaryColumn()
  id!: string;

  @Column()
  document!: string;

  @Column()
  cityId: string;

  @ManyToOne(() => City, (city) => city.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'city_id' })
  city: City;
}
