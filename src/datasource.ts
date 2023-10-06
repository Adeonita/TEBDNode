import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { City } from './models/city';
import { Diagnostic } from './models/diagnostic';
import { HealthOrganization } from './models/health-organization';
import { Pacient } from './models/pacient';
import { Hospitalization } from './models/hospitalization';
import { Procedure } from './models/procedure';

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  database: 'datasus',
  username: 'datasus',
  password: process.env.DB_PASSWORD,
  entities: [
    City,
    Diagnostic,
    HealthOrganization,
    Procedure,
    Pacient,
    Hospitalization,
  ],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
  logger: 'debug',
});
