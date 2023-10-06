require('dotenv/config');

import { dataSource } from './datasource';
import loadCities from './loaders/loadCities';
import loadDiagnostics from './loaders/loadDiagnostics';
import loadSus from './loaders/loadSus';
import loadProcedures from './loaders/loadProcedures';
import loadHealthOrganization from './loaders/loadHealthOrganization';
import { writeFileSync } from 'fs';

async function execute() {
  const ds = await dataSource.initialize();
  const [cities, cids, procedures] = await ds.manager.transaction(async (tx) =>
    Promise.all([loadCities(tx), loadDiagnostics(tx), loadProcedures(tx)]),
  );

  const healthOrganizations = await loadHealthOrganization(ds.manager);

  console.log({
    cities: cities.length,
    cids: cids.length,
    procedures: procedures.length,
    healthOrganizations: healthOrganizations.length,
  });

  const hospitalizations = await loadSus(ds.manager, {
    cities,
    cids,
    procedures,
  });

  console.log({
    hospitalizations: hospitalizations.length,
  });
}

function saveError(e) {
  writeFileSync('error.log', JSON.stringify(e));
  throw e;
}

execute().catch(saveError);
