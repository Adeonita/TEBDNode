import { join } from 'path';
import { EntityManager } from 'typeorm';
import loadCsvAndExec from '../helpers/loadCsvAndExec';
import { Diagnostic } from '../models/diagnostic';

interface Cid {
  codigo: string;
  descricao: string;
}

export default async function loadDiagnostics(manager: EntityManager) {
  const path = join(__dirname, '..', '..', 'datasets', 'dimensions', 'cid.csv');
  const repo = manager.getRepository(Diagnostic);
  const cids = await loadCsvAndExec({
    path,
    delimiter: ';',
    exec: async (cid: Cid) =>
      repo.create({
        id: cid.codigo,
        name: cid.descricao,
      }),
  });

  return repo.save(cids);
}
