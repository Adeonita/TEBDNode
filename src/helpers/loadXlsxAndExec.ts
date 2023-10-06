import { createReadStream } from 'fs';
import { ExcelReader } from 'node-excel-stream';

interface LoadOdsOptions<TInput, TResult> {
  path: string;
  exec: (row: TInput) => Promise<TResult>;
  schema: unknown;
}

export default function loadXlsxAndExec<TInput, TResult = unknown>({
  path,
  exec,
  schema,
}: LoadOdsOptions<TInput, TResult>) {
  return new Promise<TResult[]>(async (resolve, reject) => {
    const promises: Promise<TResult>[] = [];
    const stream = createReadStream(path);
    const reader = new ExcelReader(stream, schema);
    reader
      .eachRow((rowData, rowNum, sheetSchema) => {
        promises.push(exec(rowData));
      })
      .then(async () => resolve(await Promise.all(promises)))
      .catch(reject);
  });
}
