import * as fs from 'fs';
import csv = require('csvtojson');

interface LoadCsvOptions<TInput, TResult> {
  path: string;
  delimiter?: string;
  exec: (value: TInput) => Promise<TResult>;
}

export default function loadCsvAndExec<TInput, TResult = unknown>({
  path,
  exec,
  delimiter = ',',
}: LoadCsvOptions<TInput, TResult>) {
  return new Promise<TResult[]>((resolve, reject) => {
    const promises: Promise<TResult>[] = [];
    csv({ delimiter })
      .fromStream(fs.createReadStream(path))
      .subscribe(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (data: TInput, index) => {
          promises.push(exec(data));
        },
        (err) => {
          throw err;
        },
        async () => {
          try {
            resolve(await Promise.all(promises));
          } catch (e) {
            reject(e);
          }
        },
      );
  });
}
