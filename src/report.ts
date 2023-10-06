import { readdirSync, writeFileSync } from 'fs';
import { chunk } from 'lodash';
import { join } from 'path';
import loadCsvAndExec from './helpers/loadCsvAndExec';

async function execute() {
  const path = join(__dirname, '..', 'datasets', 'sus');

  let result = 'mês\t-\tqtd\n';
  for (const file of readdirSync(path)) {
    const fullpath = join(path, file);
    const registers = await loadCsvAndExec<{ N_AIH: string }, string>({
      path: fullpath,
      exec: async (value) => value.N_AIH,
    });
    const monthYear = chunk(file.replace(/\D/g, '').split(''), 2)
      .map((x) => x.join(''))
      .reverse()
      .join('/');
    result += `${monthYear}\t-\t${registers.length}\n`;
  }

  writeFileSync(join(__dirname, '..', 'report.log'), result);
}

execute().catch(console.error);
