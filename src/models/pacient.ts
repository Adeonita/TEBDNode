import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EducationalLevel } from './enums/educational-level.enum';
import { Ethnic } from './enums/ethnic.enum';
import { Gender } from './enums/gender.enum';

@Entity({ name: 'pacients' })
export class Pacient {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ enum: Gender })
  gender!: Gender;

  @Column({ type: 'smallint' })
  age!: number;

  @Column()
  isDead: boolean;

  @Column()
  childCount!: number;

  @Column({ enum: Ethnic })
  ethnic!: Ethnic;

  @Column()
  role!: string;

  @Column({ enum: EducationalLevel })
  educationLevel!: EducationalLevel;
}
