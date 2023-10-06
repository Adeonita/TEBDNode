import { join } from 'path';
import { Procedure } from '../models/procedure';
import { EntityManager } from 'typeorm';
import loadCsvAndExec from '../helpers/loadCsvAndExec';

interface ProcedureRaw {
  codproc: string;
  nome: string;
}

export default async function loadProcedures(manager: EntityManager) {
  const path = join(
    __dirname,
    '..',
    '..',
    'datasets',
    'dimensions',
    'procedures.csv',
  );
  const repo = manager.getRepository(Procedure);

  const procedures = await loadCsvAndExec({
    path,
    delimiter: ';',
    exec: async (procedure: ProcedureRaw) =>
      repo.create({
        id: procedure.codproc,
        name: procedure.nome,
      }),
  });

  return repo.save(procedures);
}
