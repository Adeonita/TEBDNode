import { join } from 'path';
import { EntityManager } from 'typeorm';
import { City } from '../models/city';
import loadXlsxAndExec from '../helpers/loadXlsxAndExec';

interface RawCity {
  codigo: string;
  nome: string;
}

export default async function loadCities(manager: EntityManager) {
  const path = join(
    __dirname,
    '..',
    '..',
    'datasets',
    'dimensions',
    'cities.xlsx',
  );
  const repo = manager.getRepository(City);
  const cities: City[] = await loadXlsxAndExec({
    path,
    schema: {
      sheets: [
        {
          name: 'cities',
          rows: {
            headerRow: 1,
            allowedHeaders: [
              {
                name: 'id',
                key: 'id',
              },
              {
                name: 'codigo',
                key: 'codigo',
              },
              { name: 'nome', key: 'nome' },
            ],
          },
        },
      ],
    },
    exec: async (city: RawCity) =>
      repo.create({
        id: city.codigo,
        name: parseCityName(city.nome),
      }),
  });

  return repo.save(cities);
}

function parseCityName(nome: string): string {
  const splits = nome
    .trim()
    .replace(/\s{2,}/g, ' ')
    .split(' ');
  const idx = splits.findIndex(
    (e) => e.match(/^[().,:!?-]/) || !isNaN(parseFloat(e)),
  );

  return splits.slice(0, idx).join(' ');
}
